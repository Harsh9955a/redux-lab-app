import React from "react";
import { useDispatch } from "react-redux";
import { postLiked, postDeleted } from "../features/posts/postsSlice";

// React.memo prevents this row from re-rendering unless its own props change,
// even if other posts in the list update.
const PostItem = React.memo(function PostItem({ post, platformName }) {
  const dispatch = useDispatch();
  console.log("Rendering:", post.title); // watch the console to see memo in action

  return (
    <li style={{ marginBottom: 8 }}>
      <strong>{post.title}</strong> — {platformName} — 👍 {post.likes}
      <button onClick={() => dispatch(postLiked(post.id))} style={{ marginLeft: 8 }}>
        Like
      </button>
      <button onClick={() => dispatch(postDeleted(post.id))} style={{ marginLeft: 4 }}>
        Delete
      </button>
    </li>
  );
});

export default PostItem;
