import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm xác định tab đang active
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow flex items-center justify-between px-10 py-4">
      <div className="font-bold text-xl text-gray-900">VocabApp</div>
      <nav className="flex gap-7 ml-14">
        <button
          className={`text-base font-medium ${
            isActive("/dashboard")
              ? "text-blue-600 font-bold"
              : "text-gray-800 hover:text-blue-600"
          }`}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`text-base font-medium ${
            isActive("/categories")
              ? "text-blue-600 font-bold"
              : "text-gray-800 hover:text-blue-600"
          }`}
          onClick={() => navigate("/categories")}
        >
          Categories
        </button>
        <button
          className={`text-base font-medium ${
            isActive("/vocabulary")
              ? "text-blue-600 font-bold"
              : "text-gray-800 hover:text-blue-600"
          }`}
          onClick={() => navigate("/vocabulary")}
        >
          Vocabulary
        </button>
        <button
          className={`text-base font-medium ${
            isActive("/flashcards")
              ? "text-blue-600 font-bold"
              : "text-gray-800 hover:text-blue-600"
          }`}
          onClick={() => navigate("/flashcards")}
        >
          Flashcards
        </button>
        <button
          className={`text-base font-medium ${
            isActive("/quiz")
              ? "text-blue-600 font-bold"
              : "text-gray-800 hover:text-blue-600"
          }`}
          onClick={() => navigate("/quiz")}
        >
          Quiz
        </button>
      </nav>
      <button
        className="bg-red-400 text-white font-medium rounded-md px-6 py-2 shadow hover:bg-red-500 transition"
        onClick={() => navigate("/")}
      >
        Logout
      </button>
    </header>
  );
}