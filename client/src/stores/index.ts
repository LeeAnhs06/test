import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import categoriesReducer from "../slices/categoriesSlice";
import vocabReducer from "../slices/vocabSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    vocab: vocabReducer          
  }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;