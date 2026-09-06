import { createSelector } from "@reduxjs/toolkit"; // re-exports reselect's createSelector

// ---- Input selectors (cheap, non-memoized) ----
const selectPostsById = (state) => state.posts.byId;
const selectPostsAllIds = (state) => state.posts.allIds;

// ---- Memoized derived state ----

// 1. All posts as an array (only recomputes when byId/allIds actually change)
export const selectAllPosts = createSelector(
  [selectPostsById, selectPostsAllIds],
  (byId, allIds) => allIds.map((id) => byId[id])
);

// 2. Posts filtered by platform — expensive-ish computation, memoized
export const selectPostsByPlatform = createSelector(
  [selectAllPosts, (state, platformId) => platformId],
  (posts, platformId) =>
    platformId ? posts.filter((p) => p.platformId === platformId) : posts
);

// 3. Grouped data: posts count per platform (derived/aggregated state)
export const selectPostCountByPlatform = createSelector(
  [selectAllPosts],
  (posts) =>
    posts.reduce((acc, post) => {
      acc[post.platformId] = (acc[post.platformId] || 0) + 1;
      return acc;
    }, {})
);

// 4. Total likes across all posts (aggregate derived value)
export const selectTotalLikes = createSelector([selectAllPosts], (posts) =>
  posts.reduce((sum, p) => sum + p.likes, 0)
);

// 5. Posts sorted by likes (descending) — "top posts"
export const selectTopPosts = createSelector([selectAllPosts], (posts) =>
  [...posts].sort((a, b) => b.likes - a.likes)
);
