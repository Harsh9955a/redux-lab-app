import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPostsApi, createPostApi, deletePostApi } from "../../api/mockApi";

// ---- Async thunks (mock API calls) ----
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const posts = await fetchPostsApi();
  return posts;
});

export const addPostAsync = createAsyncThunk(
  "posts/addPostAsync",
  async (post) => {
    const created = await createPostApi(post);
    return created;
  }
);

export const deletePostAsync = createAsyncThunk(
  "posts/deletePostAsync",
  async (id) => {
    await deletePostApi(id);
    return id;
  }
);

// ---- Normalized initial state ----
const initialState = {
  byId: {},
  allIds: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Synchronous CRUD (no fake network delay) for quick local edits
    postAdded: {
      reducer(state, action) {
        const post = action.payload;
        state.byId[post.id] = post;
        state.allIds.push(post.id);
      },
      prepare(title, platformId) {
        return {
          payload: { id: Date.now(), title, platformId, likes: 0 },
        };
      },
    },
    postUpdated: (state, action) => {
      const { id, title } = action.payload;
      if (state.byId[id]) state.byId[id].title = title;
    },
    postLiked: (state, action) => {
      const id = action.payload;
      if (state.byId[id]) state.byId[id].likes += 1;
    },
    postDeleted: (state, action) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((pid) => pid !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts lifecycle
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.byId = {};
        state.allIds = [];
        action.payload.forEach((post) => {
          state.byId[post.id] = post;
          state.allIds.push(post.id);
        });
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // addPostAsync
      .addCase(addPostAsync.fulfilled, (state, action) => {
        const post = action.payload;
        state.byId[post.id] = post;
        state.allIds.push(post.id);
      })
      // deletePostAsync
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        const id = action.payload;
        delete state.byId[id];
        state.allIds = state.allIds.filter((pid) => pid !== id);
      });
  },
});

export const { postAdded, postUpdated, postLiked, postDeleted } =
  postsSlice.actions;
export default postsSlice.reducer;

// Basic (non-memoized) selectors — live in this file for convenience,
// memoized versions live in postsSelectors.js (Experiment 2)
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostById = (state, id) => state.posts.byId[id];
