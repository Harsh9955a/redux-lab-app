import { createSlice } from "@reduxjs/toolkit";

// Normalized shape: byId (lookup table) + allIds (order list)
const initialState = {
  byId: {
    1: { id: 1, name: "Instagram" },
    2: { id: 2, name: "Twitter/X" },
    3: { id: 3, name: "LinkedIn" },
  },
  allIds: [1, 2, 3],
};

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    platformAdded: (state, action) => {
      const { id, name } = action.payload;
      state.byId[id] = { id, name };
      state.allIds.push(id);
    },
    platformRemoved: (state, action) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((pid) => pid !== id);
    },
  },
});

export const { platformAdded, platformRemoved } = platformsSlice.actions;
export default platformsSlice.reducer;

// Basic (non-memoized) selectors
export const selectAllPlatforms = (state) =>
  state.platforms.allIds.map((id) => state.platforms.byId[id]);
export const selectPlatformById = (state, id) => state.platforms.byId[id];
