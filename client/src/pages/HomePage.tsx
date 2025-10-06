import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const handleLogout = () => {
    dispatch(logout());
    Swal.fire({
  icon: "success",
  title: "Đã đăng xuất tài khoản!",
  showConfirmButton: false,
  timer: 1500
});
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // Danh sách menu và đường dẫn
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Categories", path: "/categories" },
    { name: "Vocabulary", path: "/vocabulary" },
    { name: "Flashcards", path: "/flashcards" },
    { name: "Quiz", path: "/quiz" },
  ];

  const handleNavClick = (path: string) => {
    // Nếu đã đăng nhập thì điều hướng đúng, chưa thì điều hướng về login
    if (currentUser) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between px-10 py-4">
        <div className="font-bold text-xl text-gray-900">VocabApp</div>
        <nav className="flex gap-7 ml-14">
          {navItems.map(item => (
            <button
              key={item.name}
              className="text-gray-800 text-base font-medium hover:text-blue-600 bg-transparent border-none"
              onClick={() => handleNavClick(item.path)}
            >
              {item.name}
            </button>
          ))}
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

      <footer className="bg-white py-4 text-center text-gray-700 text-[1rem] shadow">
        © 2024 VocabApp. All rights reserved.
      </footer>
    </div>
  );
}