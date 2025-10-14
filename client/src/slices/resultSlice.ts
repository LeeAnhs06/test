import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Result {
  date: string;
  categoryId: number;
  score: number;
  total: number;
}

interface ResultState {
  results: Result[];
  loading: boolean;
  error: string | null;
}

const initialState: ResultState = {
  results: [],
  loading: false,
  error: null,
};

export const fetchResults = createAsyncThunk(
  "results/fetchResults",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Result[]>("http://localhost:8000/results");
      return data;
    } catch {
      return rejectWithValue("failed to fetch results");
    }
  }
);

export const addResult = createAsyncThunk(
  "results/addResult",
  async (payload: Result, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<Result>("http://localhost:8000/results", payload);
      return data;
    } catch {
      return rejectWithValue("failed to add result");
    }
  }
);

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchResults.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false; state.results = action.payload;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      })
      .addCase(addResult.fulfilled, (state, action) => {
        state.results.push(action.payload);
      });
  }
});

export default resultSlice.reducer;