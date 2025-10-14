import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../stores";
import { fetchVocabs, Vocab } from "../slices/vocabSlice";
import { fetchCategories, Category } from "../slices/categoriesSlice";
import { addResult, fetchResults, Result } from "../slices/resultSlice";

export default function QuizPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vocabs } = useSelector((state: RootState) => state.vocab);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { results } = useSelector((state: RootState) => state.result);

  // State
  const [selectedCategoryId, setSelectedCategoryId] = useState(0); // 0 = All
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); // index of selected answer for each question
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    dispatch(fetchVocabs());
    dispatch(fetchCategories());
    dispatch(fetchResults());
  }, [dispatch]);

  // Quizzable vocabs
  const quizVocabs = vocabs.filter(vocab =>
    (selectedCategoryId === 0 || vocab.categoryId === selectedCategoryId)
  );

  // Questions (one per vocab)
  const questions = quizVocabs.map(vocab => {
    // 2 đáp án: 1 đúng (meaning của vocab), 1 sai (random meaning khác)
    const wrongs = quizVocabs.filter(v => v.id !== vocab.id).map(v => v.meaning);
    const wrong = wrongs[Math.floor(Math.random() * wrongs.length)] || "";
    const options = [vocab.meaning, wrong].sort(() => Math.random() - 0.5);
    return {
      word: vocab.word,
      correct: vocab.meaning,
      options
    };
  });

  // Start quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentIdx(0);
    setAnswers(Array(questions.length).fill(-1));
    setShowResult(false);
    setScore(0);
  };

  const handleSelectAnswer = (ansIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = ansIdx;
    setAnswers(newAnswers);
    // Kiểm tra đúng/sai, update score nếu đúng
    if (questions[currentIdx].options[ansIdx] === questions[currentIdx].correct) {
      // Nếu trước đó chưa đúng, mới cộng điểm
      if (answers[currentIdx] !== ansIdx) {
        setScore(s => s + 1);
      }
    } else {
      // Nếu trước đó đã chọn đúng, mà giờ chọn sai, trừ điểm
      if (answers[currentIdx] !== -1 && questions[currentIdx].options[answers[currentIdx]] === questions[currentIdx].correct) {
        setScore(s => s - 1);
      }
    }
  };

  // next
  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  // pervious
  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  //submit quiz
  const handleFinish = () => {
    setShowResult(true);
    setQuizStarted(false);
    //save result
    dispatch(addResult({
      date: new Date().toISOString(),
      categoryId: selectedCategoryId,
      score,
      total: questions.length
    }));
  };

  //Quizz history
  const getCategoryName = (id: number) =>
    categories.find(cat => cat.id === id)?.name || "All";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 px-10">
        <div className="mt-8 mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Vocabulary Quiz</h2>
          {!quizStarted && !showResult && (
            <button
              className="bg-green-500 text-white font-medium rounded-md px-6 py-2 shadow hover:bg-green-600 transition"
              onClick={handleStartQuiz}
              disabled={questions.length === 0}
            >
              Start Quiz
            </button>
          )}
        </div>
        {/* Chọn category */}
        <select
          className="w-full rounded border border-gray-300 px-4 py-2 mb-6 focus:outline-none bg-white"
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(Number(e.target.value))}
          disabled={quizStarted || showResult}
        >
          <option value={0}>All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Quiz tiến trình + nội dung */}
        {quizStarted && questions.length > 0 && (
          <>
            <div className="flex justify-between text-gray-700 text-sm mb-1">
              <span>Progress</span>
              <span>{currentIdx + 1}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentIdx + 1) / questions.length) * 100}%`
                }}
              />
            </div>
            <div className="rounded-xl shadow bg-white px-8 py-7 mb-8">
              <div className="font-semibold text-lg mb-4">
                What is the meaning of "<span className="text-blue-500">{questions[currentIdx].word}</span>"?
              </div>
              <div className="flex flex-col gap-3">
                {questions[currentIdx].options.map((opt, idx) => {
                  // Nếu đã chọn, hiển thị màu đúng/sai
                  let bg = "bg-white";
                  if (answers[currentIdx] !== -1) {
                    if (idx === answers[currentIdx]) {
                      bg = opt === questions[currentIdx].correct ? "bg-green-100" : "bg-red-100";
                    }
                  }
                  return (
                    <button
                      key={idx}
                      className={`w-full rounded px-4 py-3 text-left border border-gray-300 font-medium text-base transition ${bg}`}
                      style={{
                        cursor: answers[currentIdx] !== -1 ? "default" : "pointer"
                      }}
                      disabled={answers[currentIdx] !== -1}
                      onClick={() => handleSelectAnswer(idx)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <button
                className="px-5 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
                onClick={handlePrev}
                disabled={currentIdx === 0}
              >
                Previous
              </button>
              {currentIdx < questions.length - 1 ? (
                <button
                  className="px-5 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
                  onClick={handleNext}
                  disabled={answers[currentIdx] === -1}
                >
                  Next
                </button>
              ) : (
                <button
                  className="px-5 py-2 rounded bg-green-500 text-white font-medium hover:bg-green-600"
                  onClick={handleFinish}
                  disabled={answers[currentIdx] === -1}
                >
                  Finish
                </button>
              )}
            </div>
          </>
        )}

        {/* Kết quả */}
        {showResult && (
          <div className="rounded-xl shadow bg-white px-8 py-7 mb-8 text-center">
            <div className="font-bold text-2xl mb-2 text-gray-900">Quiz Completed!</div>
            <div className="text-lg mb-2">Score: <span className="font-bold">{score}/{questions.length}</span></div>
            <button
              className="px-5 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 mt-2"
              onClick={() => {
                setShowResult(false);
                setQuizStarted(false);
                setAnswers([]);
                setScore(0);
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Quiz History */}
        <h3 className="text-lg font-bold mt-8 mb-2 text-gray-900">Quiz History</h3>
        <div className="rounded-lg shadow bg-white mb-10">
          <table className="w-full">
            <thead>
              <tr className="text-gray-600 text-left font-semibold text-base">
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    No quiz history.
                  </td>
                </tr>
              ) : (
                results.map((res, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">{new Date(res.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{getCategoryName(res.categoryId)}</td>
                    <td className="px-4 py-3">{res.score}/{res.total}</td>
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
  );
}