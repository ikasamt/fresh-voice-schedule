import { walk } from "https://deno.land/std@0.208.0/fs/walk.ts";
import { join, relative, dirname } from "https://deno.land/std@0.208.0/path/mod.ts";

interface StoryFile {
  path: string;
  relativePath: string;
  componentName: string;
  importPath: string;
}

interface CatalogItem {
  label: string;
  path: string;
  category?: string;
}

async function findStoryFiles(): Promise<StoryFile[]> {
  const storyFiles: StoryFile[] = [];
  
  for await (const entry of walk(".", {
    exts: [".stories.tsx"],
    skip: [/node_modules/, /\.git/, /scripts/],
  })) {
    const relativePath = relative(".", entry.path);
    const componentName = entry.name.replace(".stories.tsx", "");
    const importPath = relativePath;
    
    storyFiles.push({
      path: entry.path,
      relativePath,
      componentName,
      importPath,
    });
  }
  
  return storyFiles;
}

function generateCatalogRoute(storyFiles: StoryFile[]): string {
  const imports = storyFiles.map((file, index) => 
    `import * as Story${index} from "../${file.importPath}";`
  ).join("\n");

  const menuItems: CatalogItem[] = [
    { label: "Overview", path: "/catalog", category: "Getting Started" },
  ];

  storyFiles.forEach((file, index) => {
    const storyVar = `Story${index}`;
    menuItems.push({
      label: file.componentName,
      path: `/catalog/generated/${file.componentName.toLowerCase()}`,
      category: "Components",
    });
  });

  return `// This file is auto-generated. Do not edit manually.
import { ComponentChildren } from "preact";
${imports}

interface MenuItem {
  label: string;
  path: string;
  category?: string;
}

export const generatedMenuItems: MenuItem[] = ${JSON.stringify(menuItems, null, 2)};

export const storyModules = {
${storyFiles.map((file, index) => `  "${file.componentName}": Story${index},`).join("\n")}
};
`;
}

async function generateStoryPages(storyFiles: StoryFile[]): Promise<void> {
  // generated ディレクトリを作成
  const generatedDir = "./routes/catalog/generated";
  try {
    await Deno.mkdir(generatedDir, { recursive: true });
  } catch {
    // ディレクトリが既に存在する場合は無視
  }

  // 各ストーリーファイルに対してページを生成
  for (const file of storyFiles) {
    const pageContent = `import { Head } from "$fresh/runtime.ts";
import CatalogLayout from "../../../islands/CatalogLayout.tsx";
import StoryRenderer from "../../../islands/StoryRenderer.tsx";
import * as StoryModule from "../../../${file.relativePath}";

export default function ${file.componentName}CatalogPage() {
  return (
    <>
      <Head>
        <title>${file.componentName} - UI Catalog</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <CatalogLayout currentPath="/catalog/generated/${file.componentName.toLowerCase()}">
        <StoryRenderer 
          metadata={StoryModule.metadata}
          stories={StoryModule.stories}
        />
      </CatalogLayout>
    </>
  );
}`;

    const pagePath = join(generatedDir, `${file.componentName.toLowerCase()}.tsx`);
    await Deno.writeTextFile(pagePath, pageContent);
  }
}

async function main() {
  console.log("🔍 Searching for story files...");
  const storyFiles = await findStoryFiles();
  console.log(`📚 Found ${storyFiles.length} story files`);

  console.log("📝 Generating catalog data...");
  const catalogRoute = generateCatalogRoute(storyFiles);
  await Deno.writeTextFile("./utils/catalog-generated.ts", catalogRoute);

  console.log("📄 Generating story pages...");
  await generateStoryPages(storyFiles);

  console.log("✅ Catalog generation complete!");
}

if (import.meta.main) {
  await main();
}