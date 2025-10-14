import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Type
export interface Vocab {
  id: number;
  word: string;
  meaning: string;
  categoryId: number;
  isLearned?: boolean; // THÊM TRƯỜNG NÀY
}

interface VocabState {
  vocabs: Vocab[];
  loading: boolean;
  error: string | null;
}

const initialState: VocabState = {
  vocabs: [],
  loading: false,
  error: null,
};

// Async thunk CRUD
export const fetchVocabs = createAsyncThunk(
  "vocabs/fetchVocabs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Vocab[]>("http://localhost:8000/vocabs");
      return data;
    } catch {
      return rejectWithValue("failed to fetch");
    }
  }
);

export const addVocab = createAsyncThunk(
  "vocabs/addVocab",
  async (payload: Omit<Vocab, "id">, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<Vocab>("http://localhost:8000/vocabs", payload);
      return data;
    } catch {
      return rejectWithValue("failed to add");
    }
  }
);

export const updateVocab = createAsyncThunk(
  "vocabs/updateVocab",
  async (payload: Vocab, { rejectWithValue }) => {
    try {
      const { id, ...rest } = payload;
      const { data } = await axios.put<Vocab>(`http://localhost:8000/vocabs/${id}`, rest);
      return data;
    } catch {
      return rejectWithValue("failed to update");
    }
  }
);

export const deleteVocab = createAsyncThunk(
  "vocabs/deleteVocab",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8000/vocabs/${id}`);
      return id;
    } catch {
      return rejectWithValue("failed to delete");
    }
  }
);

// PATCH - đánh dấu đã học
export const markVocabAsLearned = createAsyncThunk(
  "vocabs/markVocabAsLearned",
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch<Vocab>(`http://localhost:8000/vocabs/${id}`, { isLearned: true });
      return data;
    } catch {
      return rejectWithValue("failed to update");
    }
  }
);

const vocabSlice = createSlice({
  name: "vocabs",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchVocabs.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchVocabs.fulfilled, (state, action) => {
        state.loading = false; state.vocabs = action.payload;
      })
      .addCase(fetchVocabs.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      })
      .addCase(addVocab.fulfilled, (state, action) => {
        state.vocabs.unshift(action.payload);
      })
      .addCase(updateVocab.fulfilled, (state, action) => {
        state.vocabs = state.vocabs.map(vocab =>
          vocab.id === action.payload.id ? action.payload : vocab
        );
      })
      .addCase(deleteVocab.fulfilled, (state, action) => {
        state.vocabs = state.vocabs.filter(vocab => vocab.id !== action.payload);
      })
      // THÊM CASE NÀY
      .addCase(markVocabAsLearned.fulfilled, (state, action) => {
        state.vocabs = state.vocabs.map(vocab =>
          vocab.id === action.payload.id ? action.payload : vocab
        );
      });
  }
});

export default vocabSlice.reducer;