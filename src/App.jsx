import React from "react";
import AddPost from "./components/AddPost";
import PostList from "./components/PostList";

export default function App() {
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Redux Toolkit Lab — Posts & Platforms</h1>
      <AddPost />
      <PostList />
    </div>
  );
}
