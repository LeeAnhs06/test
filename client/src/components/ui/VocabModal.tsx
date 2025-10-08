import React from "react";
import { Vocab } from "../../slices/vocabSlice";
import { Category } from "../../slices/categoriesSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { word: string; meaning: string; categoryId: number }) => void;
  categories: Category[];
  initialData?: Vocab;
}

export default function VocabModal({ open, onClose, onSubmit, categories, initialData }: Props) {
  const [word, setWord] = React.useState(initialData?.word || "");
  const [meaning, setMeaning] = React.useState(initialData?.meaning || "");
  const [categoryId, setCategoryId] = React.useState(initialData?.categoryId || categories[0]?.id || 0);

  React.useEffect(() => {
    if (open) {
      setWord(initialData?.word || "");
      setMeaning(initialData?.meaning || "");
      setCategoryId(initialData?.categoryId || categories[0]?.id || 0);
    }
  }, [open, initialData, categories]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-[430px] p-7 shadow-lg relative">
        <button
          className="absolute top-4 right-5 text-xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Word" : "Add New Word"}
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Word</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
              value={word}
              onChange={e => setWord(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Meaning</label>
            <textarea
              className="w-full rounded border px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
              value={meaning}
              onChange={e => setMeaning(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Category</label>
            <select
              className="w-full rounded border px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
              value={categoryId}
              onChange={e => setCategoryId(Number(e.target.value))}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <button
              className="px-5 py-2 rounded bg-gray-400 text-white font-medium hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
              onClick={() => onSubmit({ word, meaning, categoryId })}
              disabled={!word.trim() || !meaning.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}