import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";

interface StoryMetadata {
  title: string;
  description: string;
  category: string;
}

interface Story {
  name: string;
  description?: string;
  render: (props: any) => ComponentChildren;
}

interface Props {
  metadata: StoryMetadata;
  stories: Story[];
}

export default function StoryRenderer({ metadata, stories }: Props) {
  const [selectedStory, setSelectedStory] = useState(0);
  const currentStory = stories[selectedStory];

  return (
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">{metadata.title}</h1>
      <p class="text-lg text-gray-600 mb-8">{metadata.description}</p>

      {/* ストーリー選択タブ */}
      <div class="border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8">
          {stories.map((story, index) => (
            <button
              key={index}
              onClick={() => setSelectedStory(index)}
              class={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${selectedStory === index
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {story.name}
            </button>
          ))}
        </nav>
      </div>

      {/* ストーリーの説明 */}
      {currentStory.description && (
        <p class="text-gray-600 mb-6">{currentStory.description}</p>
      )}

      {/* プレビューエリア */}
      <div class="border border-gray-200 rounded-lg p-8 bg-gray-50">
        <div class="bg-white rounded-lg p-6">
          {currentStory.render({})}
        </div>
      </div>

      {/* インタラクション情報 */}
      <div class="mt-8 space-y-4">
        <h3 class="text-lg font-semibold text-gray-900">インタラクション</h3>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-sm text-yellow-800">
            このプレビューでは、実際のインタラクション（クリック、編集など）がコンソールに出力されます。
            開発者ツールのコンソールを確認してください。
          </p>
        </div>
      </div>
    </div>
  );
}