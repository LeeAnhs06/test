import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Category {
  id: number;
  name: string;
  description?: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

// get 
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Category[]>("http://localhost:8000/categories");
      return data;
    } catch {
      return rejectWithValue("failed to fetch ");
    }
  }
);

// add 
export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (payload: Omit<Category, "id">, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<Category>("http://localhost:8000/categories", payload);
      return data;
    } catch {
      return rejectWithValue("failed to add");
    }
  }
);

// update 
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (payload: Category, { rejectWithValue }) => {
    try {
      const { id, ...rest } = payload;
      const { data } = await axios.put<Category>(`http://localhost:8000/categories/${id}`, rest);
      return data;
    } catch {
      return rejectWithValue("failed to update");
    }
  }
);

// delete
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8000/categories/${id}`);
      return id;
    } catch {
      return rejectWithValue("failed to delete");
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false; state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map(cat =>
          cat.id === action.payload.id ? action.payload : cat
        );
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
      });
  }
});

export default categoriesSlice.reducer;