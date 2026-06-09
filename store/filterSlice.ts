import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  selectedSoftware: string;
  selectedTag: string;
  searchInput: string;
  activeKeyword: string;
  sortBy: number;
}

const initialState: FilterState = {
  selectedSoftware: "전체",
  selectedTag: "",
  searchInput: "",
  activeKeyword: "",
  sortBy: 0,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSelectedSoftware: (state, action: PayloadAction<string>) => {
      state.selectedSoftware = action.payload;
      state.selectedTag = "";
      state.searchInput = "";
      state.activeKeyword = "";
    },
    setSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTag = action.payload;
    },
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    setActiveKeyword: (state, action: PayloadAction<string>) => {
      state.activeKeyword = action.payload;
    },
    setSortBy: (state, action: PayloadAction<number>) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.selectedTag = "";
      state.searchInput = "";
      state.activeKeyword = "";
    },
  },
});

export const {
  setSelectedSoftware,
  setSelectedTag,
  setSearchInput,
  setActiveKeyword,
  setSortBy,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
