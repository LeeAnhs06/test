import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}
interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean; //đăng ký
  currentUser: User | null; //đăng nhập
}

const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
  currentUser: null,
};

//Đăng ký user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      await axios.post("http://localhost:8000/users", payload);
      return true;
    } catch {
      return rejectWithValue("Register failed!");
    }
  }
);

//Đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<User[]>(
        `http://localhost:8000/users?email=${payload.email}&password=${payload.password}`
      );
      if (data.length === 0) {
        return rejectWithValue("Email or password is incorrect!");
      }
      localStorage.setItem("currentUser", JSON.stringify(data[0]));
      return data[0];
    } catch {
      return rejectWithValue("Login failed!");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },
    loadUserFromStorage(state) {
      const userStr = localStorage.getItem("currentUser");
      state.currentUser = userStr ? JSON.parse(userStr) : null;
    },
    // reset success sau đk
    reset(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: builder => {
    builder
      //Đăng ký
      .addCase(registerUser.pending, state => {
        state.loading = true; state.error = null; state.success = false;
      })
      .addCase(registerUser.fulfilled, state => {
        state.loading = false; state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string; state.success = false;
      })
      //Đăng nhập
      .addCase(loginUser.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload as User;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, loadUserFromStorage, reset } = authSlice.actions;
export default authSlice.reducer;