import { useState } from "preact/hooks";
import AddScheduleModal from "./AddScheduleModal.tsx";

export default function AddModalCatalog() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        モーダルを表示
      </button>

      {showModal && (
        <AddScheduleModal
          onClose={() => setShowModal(false)}
          onSubmit={async (text, image) => {
            console.log("Submit:", { text, image });
            alert(`テキスト: ${text}\n画像: ${image ? "あり" : "なし"}`);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}