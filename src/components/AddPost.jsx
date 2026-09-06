import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAdded, addPostAsync } from "../features/posts/postsSlice";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";

export default function AddPost() {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const [title, setTitle] = useState("");
  const [platformId, setPlatformId] = useState(platforms[0]?.id || 1);

  const handleSubmit = (e, useAsync) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (useAsync) {
      dispatch(addPostAsync({ title, platformId: Number(platformId) }));
    } else {
      dispatch(postAdded(title, Number(platformId)));
    }
    setTitle("");
  };

  return (
    <form style={{ marginBottom: 16 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <select value={platformId} onChange={(e) => setPlatformId(e.target.value)}>
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button onClick={(e) => handleSubmit(e, false)}>Add (sync)</button>
      <button onClick={(e) => handleSubmit(e, true)}>Add (async/mock API)</button>
    </form>
  );
}
