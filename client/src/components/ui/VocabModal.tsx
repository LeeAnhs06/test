import React, { useState, useEffect } from "react";
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
  const [word, setWord] = useState(initialData?.word || "");
  const [meaning, setMeaning] = useState(initialData?.meaning || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || 0);

  // Thêm state cho lỗi
  const [errors, setErrors] = useState<{ word?: string; meaning?: string }>({});

  useEffect(() => {
    if (open) {
      setWord(initialData?.word || "");
      setMeaning(initialData?.meaning || "");
      setCategoryId(initialData?.categoryId || categories[0]?.id || 0);
      setErrors({});
    }
  }, [open, initialData, categories]);

  // Validate trước khi submit
  const handleSave = () => {
    const newErrors: { word?: string; meaning?: string } = {};
    if (!word.trim()) newErrors.word = "Word is required";
    if (!meaning.trim()) newErrors.meaning = "Meaning is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({ word, meaning, categoryId });
    }
  };

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
              className={`w-full rounded border px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-400 ${errors.word ? "border-red-400" : ""}`}
              value={word}
              onChange={e => setWord(e.target.value)}
            />
            {errors.word && (
              <span className="text-sm text-red-500 mt-1 block">{errors.word}</span>
            )}
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Meaning</label>
            <textarea
              className={`w-full rounded border px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-400 ${errors.meaning ? "border-red-400" : ""}`}
              value={meaning}
              onChange={e => setMeaning(e.target.value)}
              rows={3}
            />
            {errors.meaning && (
              <span className="text-sm text-red-500 mt-1 block">{errors.meaning}</span>
            )}
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
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}