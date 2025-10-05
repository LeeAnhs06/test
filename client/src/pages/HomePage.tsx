import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const handleLogout = () => {
  dispatch(logout());
};

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between px-10 py-4">
        <div className="font-bold text-xl text-gray-900">VocabApp</div>
        <nav className="flex gap-7 ml-14">
          <a href="#" className="text-gray-800 text-base font-medium hover:text-blue-600">Dashboard</a>
          <a href="#" className="text-gray-800 text-base font-medium hover:text-blue-600">Categories</a>
          <a href="#" className="text-gray-800 text-base font-medium hover:text-blue-600">Vocabulary</a>
          <a href="#" className="text-gray-800 text-base font-medium hover:text-blue-600">Flashcards</a>
          <a href="#" className="text-gray-800 text-base font-medium hover:text-blue-600">Quiz</a>
        </nav>
        {!currentUser ? (
          <button
            className="bg-blue-600 text-white font-medium rounded-md px-6 py-2 shadow hover:bg-blue-700 transition"
            onClick={handleLogin}
          >
            Login
          </button>
        ) : (
          <button
            className="bg-red-400 text-white font-medium rounded-md px-6 py-2 shadow hover:bg-red-500 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-2 text-center">Welcome to VocabApp</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Learn and practice vocabulary with flashcards and quizzes
        </p>
        <div className="flex gap-5 justify-center mb-6">
          <button className="bg-blue-600 text-white font-medium px-6 py-2 rounded-md shadow hover:bg-blue-700 transition">
            Get Started
          </button>
          <button
            className="bg-green-500 text-white font-medium px-6 py-2 rounded-md shadow hover:bg-green-600 transition"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 text-center text-gray-700 text-[1rem] shadow">
        © 2024 VocabApp. All rights reserved.
      </footer>
    </div>
  );
}