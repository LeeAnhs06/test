import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../stores";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  Category
} from "../slices/categoriesSlice";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../hooks/usePagination";

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { categories, loading } = useSelector((state: RootState) => state.categories);

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Search 
  const [search, setSearch] = useState("");

  // Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // phân trang
  const { paginatedData, totalPages } = usePagination<Category>({
    data: filteredCategories,
    currentPage,
    itemsPerPage,
  });

  // Handler mở modal thêm
  const handleAdd = () => {
    setShowAddModal(true);
  };
  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setShowEditModal(true);
  };
  const handleDelete = (cat: Category) => {
    setSelectedCategory(cat);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between px-10 py-4">
        <div className="font-bold text-xl text-gray-900">VocabApp</div>
        <nav className="flex gap-7 ml-14">
          <button className="text-gray-800 text-base font-medium hover:text-blue-600"
            onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="text-blue-600 text-base font-medium font-bold"
            onClick={() => navigate("/categories")}>Categories</button>
          <button className="text-gray-800 text-base font-medium hover:text-blue-600"
            onClick={() => navigate("/vocabulary")}>Vocabulary</button>
          <button className="text-gray-800 text-base font-medium hover:text-blue-600"
            onClick={() => navigate("/flashcards")}>Flashcards</button>
          <button className="text-gray-800 text-base font-medium hover:text-blue-600"
            onClick={() => navigate("/quiz")}>Quiz</button>
        </nav>
        <button
          className="bg-red-400 text-white font-medium rounded-md px-6 py-2 shadow hover:bg-red-500 transition"
          onClick={() => {
            navigate("/");
          }}
        >
          Logout
        </button>
      </header>
      <main className="flex-1 px-10">
        <div className="flex items-center justify-between mt-10 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Vocabulary Categories</h2>
          <button
            className="bg-green-500 text-white font-medium px-5 py-2 rounded hover:bg-green-600 transition"
            onClick={handleAdd}
          >
            Add New Category
          </button>
        </div>
        <input
          type="text"
          className="w-full rounded border border-gray-300 px-4 py-2 mb-6 focus:outline-none focus:ring focus:border-blue-400 bg-white"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="rounded-lg shadow bg-white">
          <table className="w-full">
            <thead>
              <tr className="text-gray-600 text-left font-semibold text-base">
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">DESCRIPTION</th>
                <th className="py-3 px-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                paginatedData.map(cat => (
                  <tr key={cat.id} >
                    <td className="px-4 py-3">{cat.name}</td>
                    <td className="px-4 py-3">{cat.description}</td>
                    <td className="px-4 py-3 flex gap-4">
                      <button
                        className="text-blue-600 hover:underline font-medium"
                        onClick={() => handleEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline font-medium"
                        onClick={() => handleDelete(cat)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-400"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-400"}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-400"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
      <footer className="bg-white py-4 text-center text-gray-700 text-[1rem] shadow mt-auto">
        © 2024 VocabApp. All rights reserved.
      </footer>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <CategoryModal
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedCategory(null);
          }}
          onSubmit={data => {
            if (showAddModal) {
              dispatch(addCategory(data));
            } else if (showEditModal && selectedCategory) {
              dispatch(updateCategory({ ...selectedCategory, ...data }));
            }
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedCategory(null);
          }}
          data={showEditModal ? selectedCategory : undefined}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCategory && (
        <DeleteCategoryModal
          name={selectedCategory.name}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCategory(null);
          }}
          onDelete={() => {
            dispatch(deleteCategory(selectedCategory.id));
            setShowDeleteModal(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
}

// Modal component for Add/Edit
function CategoryModal({
  onClose,
  onSubmit,
  data
}: {
  onClose: () => void;
  onSubmit: (values: { name: string; description: string }) => void;
  data?: Category | undefined;
}) {
  const [name, setName] = React.useState(data?.name || "");
  const [desc, setDesc] = React.useState(data?.description || "");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg w-[430px] p-7 shadow-lg relative">
        <button
          className="absolute top-4 right-5 text-xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-4">
          {data ? "Edit Category" : "Add Category"}
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Name</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Description</label>
            <textarea
              className="w-full rounded border px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
            />
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
              onClick={() => onSubmit({ name, description: desc })}
              disabled={!name.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal component for Delete
function DeleteCategoryModal({
  name,
  onClose,
  onDelete
}: {
  name: string;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg w-[430px] p-7 shadow-lg relative">
        <button
          className="absolute top-4 right-5 text-xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-4">Delete Category</h3>
        <p className="mb-6">Are you sure you want to delete this category?</p>
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