import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import categoriesReducer from "../slices/categoriesSlice";
import vocabReducer from "../slices/vocabSlice";
import resultReducer from "../slices/resultSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    vocab: vocabReducer,
    result: resultReducer      
  }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;