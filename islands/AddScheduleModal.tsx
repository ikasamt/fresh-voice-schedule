import { useState } from "preact/hooks";

interface Props {
  onClose: () => void;
  onSubmit: (text: string, imageData?: string) => Promise<void>;
}

export default function AddScheduleModal({ onClose, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");

  const handleImageSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        // Remove data URL prefix
        const base64Data = base64.split(',')[1];
        setSelectedImage(base64Data);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !selectedImage) return;

    setIsProcessing(true);
    try {
      await onSubmit(text, selectedImage || undefined);
    } finally {
      setIsProcessing(false);
    }
  };

  const canSubmit = (text.trim() || selectedImage) && !isProcessing;

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">新しい予定を追加</h2>
          <button
            onClick={onClose}
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          {/* Text Input */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              テキストで入力
            </label>
            <textarea
              value={text}
              onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
              placeholder="例: 明日の15時から会議"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          {/* OR Divider */}
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          {/* Image Input */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              画像から読み取る
            </label>
            <label class="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                class="hidden"
              />
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400">
                {selectedImage ? (
                  <div class="text-sm text-gray-600">
                    <svg class="mx-auto h-8 w-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {imageName}
                  </div>
                ) : (
                  <div class="text-sm text-gray-600">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    クリックして画像を選択
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div class="flex gap-3 pt-2">
            <button
              onClick={onClose}
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              class={`flex-1 px-4 py-2 rounded-lg text-white font-medium
                ${canSubmit 
                  ? "bg-indigo-600 hover:bg-indigo-700" 
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {isProcessing ? "処理中..." : "追加"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}