import AddScheduleModal from "./AddScheduleModal.tsx";

export const metadata = {
  title: "AddScheduleModal",
  description: "新しい予定を追加するためのモーダルダイアログ",
  category: "Components",
};

export const stories = [
  {
    name: "デフォルト",
    description: "モーダルを開いた状態。テキスト入力と画像アップロードの2つの方法で予定を追加できる。",
    render: () => (
      <AddScheduleModal
        onClose={() => console.log("Close modal")}
        onSubmit={async (text, image) => {
          console.log("Submit:", { text, hasImage: !!image });
          alert(`テキスト: ${text}\n画像: ${image ? "あり" : "なし"}`);
        }}
      />
    ),
  },
];