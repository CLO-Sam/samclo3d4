import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import filterReducer from "./filterSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
