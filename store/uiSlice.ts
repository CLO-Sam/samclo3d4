import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isDrawerOpen: boolean;
  isFilterModalOpen: boolean;
}

const initialState: UiState = {
  isDrawerOpen: false,
  isFilterModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    openFilterModal: (state) => {
      state.isFilterModalOpen = true;
    },
    closeFilterModal: (state) => {
      state.isFilterModalOpen = false;
    },
  },
});

export const { openDrawer, closeDrawer, openFilterModal, closeFilterModal } =
  uiSlice.actions;

export default uiSlice.reducer;
