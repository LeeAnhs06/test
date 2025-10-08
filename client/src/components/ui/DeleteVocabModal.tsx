import React from "react";

interface Props {
  open: boolean;
  word: string;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteVocabModal({ open, word, onClose, onDelete }: Props) {
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
        <h3 className="text-lg font-semibold mb-4">Delete Word</h3>
        <p className="mb-6">
          Are you sure you want to delete word <span className="font-bold">{word}</span>?
        </p>
        <div className="flex gap-3 justify-end mt-2">
          <button
            className="px-5 py-2 rounded bg-gray-400 text-white font-medium hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded bg-red-500 text-white font-medium hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}