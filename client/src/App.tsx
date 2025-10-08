import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import VocabManagementPage from "./pages/VocabManagementPage";
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
          <VocabManagementPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
export default App;