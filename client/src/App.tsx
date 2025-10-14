import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import VocabularyPage from "./pages/VocabularyPage";
import FlashcardPage from "./pages/FlashcardPage";
import QuizPage from "./pages/QuizPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={
        <ProtectedRoute>
          <CategoriesPage />
        </ProtectedRoute>
      } />
      <Route path="/vocabulary" element={
        <ProtectedRoute>
          <VocabularyPage />
        </ProtectedRoute>
      } />
      <Route path="/flashcards" element={
        <ProtectedRoute>
          <FlashcardPage />
        </ProtectedRoute>
      } />
      <Route path="/quiz" element={
  <ProtectedRoute>
    <QuizPage />
  </ProtectedRoute>
} />
    </Routes>
  );
}
export default App;