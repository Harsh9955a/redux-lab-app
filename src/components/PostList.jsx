import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, selectPostsStatus } from "../features/posts/postsSlice";
import {
  selectPostsByPlatform,
  selectPostCountByPlatform,
  selectTotalLikes,
} from "../features/posts/postsSelectors";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";
import PostItem from "./PostItem";

export default function PostList() {
  const dispatch = useDispatch();
  const status = useSelector(selectPostsStatus);
  const platforms = useSelector(selectAllPlatforms);
  const [filter, setFilter] = useState(null); // null = all platforms

  // Memoized selector: only recomputes when posts.byId/allIds or `filter` change
  const posts = useSelector((state) => selectPostsByPlatform(state, filter));
  const countByPlatform = useSelector(selectPostCountByPlatform);
  const totalLikes = useSelector(selectTotalLikes);

  useEffect(() => {
    if (status === "idle") dispatch(fetchPosts());
  }, [status, dispatch]);

  // Lookup map memoized locally with useMemo (avoids re-deriving on every render)
  const platformNameById = useMemo(
    () => Object.fromEntries(platforms.map((p) => [p.id, p.name])),
    [platforms]
  );

  if (status === "loading") return <p>Loading posts…</p>;
  if (status === "failed") return <p>Failed to load posts.</p>;

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label>Filter by platform: </label>
        <select
          value={filter ?? ""}
          onChange={(e) => setFilter(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({countByPlatform[p.id] || 0})
            </option>
          ))}
        </select>
        <span style={{ marginLeft: 16 }}>Total likes: {totalLikes}</span>
      </div>

      <ul>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            platformName={platformNameById[post.platformId] || "Unknown"}
          />
        ))}
      </ul>
    </div>
  );
}
