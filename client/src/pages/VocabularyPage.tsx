import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../stores";
import {
  fetchVocabs,
  addVocab,
  updateVocab,
  deleteVocab,
  Vocab,
} from "../slices/vocabSlice";
import { fetchCategories, Category } from "../slices/categoriesSlice";
import { usePagination } from "../hooks/usePagination";
import VocabModal from "../components/ui/VocabModal";
import DeleteVocabModal from "../components/ui/DeleteVocabModal";
import Header from "../components/common/Header";

export default function VocabularyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vocabs, loading } = useSelector((state: RootState) => state.vocab);
  const { categories } = useSelector((state: RootState) => state.categories);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<Vocab | null>(null);

  const [search, setSearch] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchVocabs());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategoryId]);

  const filteredVocabs = vocabs.filter(vocab => {
    const matchWord = vocab.word.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategoryId === 0 || vocab.categoryId === filterCategoryId;
    return matchWord && matchCategory;
  });

  const { paginatedData, totalPages } = usePagination<Vocab>({
    data: filteredVocabs,
    currentPage,
    itemsPerPage,
  });

  const getCategoryName = (id: number) =>
    categories.find(cat => cat.id === id)?.name || "";

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-100 flex flex-col px-[50px]">
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vocabulary Words</h2>
        <button
          className="bg-green-500 text-white font-medium rounded-md px-6 py-2 shadow hover:bg-green-600 transition"
          onClick={() => setShowAddModal(true)}
        >
          Add New Word
        </button>
      </div>
      {/* Filter + Search */}
      <div className="flex flex-col gap-3 mb-4">
        <select
          className="w-full rounded border-1 bg-white px-4 py-2"
          value={filterCategoryId}
          onChange={e => setFilterCategoryId(Number(e.target.value))}
        >
          <option value={0}>All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          className="w-full rounded border-1 bg-white px-4 py-2"
          placeholder="Search vocabulary..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Table */}
      <div className="rounded-lg shadow bg-white">
        <table className="w-full">
          <thead>
            <tr className="text-gray-600 text-left font-semibold text-base">
              <th className="py-3 px-4">WORD</th>
              <th className="py-3 px-4">MEANING</th>
              <th className="py-3 px-4">CATEGORY</th>
              <th className="py-3 px-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No vocabulary found.
                </td>
              </tr>
            ) : (
              paginatedData.map(vocab => (
                <tr key={vocab.id}>
                  <td className="px-4 py-3">{vocab.word}</td>
                  <td className="px-4 py-3">{vocab.meaning}</td>
                  <td className="px-4 py-3">{getCategoryName(vocab.categoryId)}</td>
                  <td className="px-4 py-3 flex gap-4">
                    <button
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => { setSelectedVocab(vocab); setShowEditModal(true); }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline font-medium"
                      onClick={() => { setSelectedVocab(vocab); setShowDeleteModal(true); }}
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
      {/* Modal Add/Edit */}
      <VocabModal
        open={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedVocab(null);
        }}
        onSubmit={data => {
          if (showAddModal) {
            dispatch(addVocab(data));
          } else if (showEditModal && selectedVocab) {
            dispatch(updateVocab({ ...selectedVocab, ...data }));
          }
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedVocab(null);
        }}
        categories={categories}
        initialData={showEditModal ? selectedVocab || undefined : undefined}
      />
      {/* Modal Delete */}
      <DeleteVocabModal
        open={showDeleteModal && !!selectedVocab}
        word={selectedVocab?.word || ""}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedVocab(null);
        }}
        onDelete={() => {
          if (selectedVocab) dispatch(deleteVocab(selectedVocab.id));
          setShowDeleteModal(false);
          setSelectedVocab(null);
        }}
      />
    </div>
    </>
  );
}