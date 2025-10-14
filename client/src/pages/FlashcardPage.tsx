import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../stores";
import { fetchVocabs, markVocabAsLearned, Vocab } from "../slices/vocabSlice";
import { fetchCategories, Category } from "../slices/categoriesSlice";
import Headers from "../components/common/Header";

export default function FlashcardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vocabs, loading } = useSelector((state: RootState) => state.vocab);
  const { categories } = useSelector((state: RootState) => state.categories);

  // State
  const [selectedCategoryId, setSelectedCategoryId] = useState(0); // 0 = All
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    dispatch(fetchVocabs());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Reset khi đổi category
  useEffect(() => {
    setCurrentIdx(0);
    setIsFlipped(false);
  }, [selectedCategoryId]);

  // Filter vocabs theo category
  const filteredVocabs = vocabs.filter(vocab =>
    (selectedCategoryId === 0 || vocab.categoryId === selectedCategoryId)
  );

  // Số lượng tổng và đã học
  const total = filteredVocabs.length;
  const learned = filteredVocabs.filter(v => v.isLearned).length;

  // Flashcard đang học
  const currentVocab = filteredVocabs[currentIdx];

  // Handler chuyển thẻ
  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx(idx => idx > 0 ? idx - 1 : idx);
  };
  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx(idx => idx < filteredVocabs.length - 1 ? idx + 1 : idx);
  };
  const handleMarkLearned = () => {
    if (currentVocab && !currentVocab.isLearned) {
      dispatch(markVocabAsLearned(currentVocab.id));
    }
  };

  return (
    <>
      <Headers />
        <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 px-10">
        <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-900">Flashcard Learning</h2>
        <select
          className="w-full rounded border bg-gray-100 px-4 py-2 mb-6"
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(Number(e.target.value))}
        >
          <option value={0}>All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Flashcard (with effect)*/}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div
            className="relative w-[420px] h-[220px] cursor-pointer mx-auto mb-6"
            style={{ perspective: "1000px" }}
            onClick={() => setIsFlipped(f => !f)}
          >
            <div className={`transition-transform duration-500 absolute w-full h-full rounded-xl shadow-lg bg-white flex items-center justify-center text-2xl font-semibold select-none
              ${isFlipped ? "rotate-y-180" : ""}`}
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* front */}
              <div className="absolute w-full h-full flex items-center justify-center"
                style={{
                  backfaceVisibility: "hidden"
                }}>
                <span>
                  {currentVocab
                    ? currentVocab.word
                    : <span className="text-gray-500">No words available</span>
                  }
                </span>
              </div>
              {/* back */}
              <div className="absolute w-full h-full flex items-center justify-center"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)"
                }}>
                <span>
                  {currentVocab
                    ? currentVocab.meaning
                    : <span className="text-gray-500">No words available</span>
                  }
                </span>
              </div>
            </div>
          </div>
          {/* Control buttons */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              className="px-5 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
              onClick={handlePrev}
              disabled={currentIdx === 0 || !currentVocab}
            >
              Previous
            </button>
            <button
              className={`px-5 py-2 rounded bg-green-500 text-white font-medium hover:bg-green-600`}
              onClick={handleMarkLearned}
              disabled={!currentVocab || currentVocab.isLearned}
            >
              Mark as Learned
            </button>
            <button
              className="px-5 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
              onClick={handleNext}
              disabled={currentIdx === filteredVocabs.length - 1 || !currentVocab}
            >
              Next
            </button>
          </div>
          {/* Progress */}
          <div className="w-full max-w-[420px] mx-auto">
            <div className="flex justify-between text-gray-700 text-sm mb-1">
              <span>Progress</span>
              <span>{learned}/{total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all"
                style={{
                  width: total === 0 ? "0%" : `${(learned / total) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Word List */}
        <h3 className="text-lg font-bold mt-10 mb-2 text-gray-900">Word List</h3>
        <div className="rounded-lg shadow bg-white mb-10">
          <table className="w-full">
            <thead>
              <tr className="text-gray-600 text-left font-semibold text-base">
                <th className="py-3 px-4">WORD</th>
                <th className="py-3 px-4">MEANING</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredVocabs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    No words available.
                  </td>
                </tr>
              ) : (
                filteredVocabs.map(vocab => (
                  <tr key={vocab.id}>
                    <td className="px-4 py-3">{vocab.word}</td>
                    <td className="px-4 py-3">{vocab.meaning}</td>
                    <td className="px-4 py-3">
                      {vocab.isLearned
                        ? <span className="text-green-500 font-medium">Learned</span>
                        : <span className="text-gray-500">Not Learned</span>
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="bg-white py-4 text-center text-gray-700 text-[1rem] shadow mt-auto">
          © 2024 VocabApp. All rights reserved.
        </footer>
      </main>
    </div>
    </>

  );
}