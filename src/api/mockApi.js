// Simulated backend — replace with real fetch() calls later.
let _posts = [
  { id: 1, title: "Hello Redux Toolkit", platformId: 1, likes: 3 },
  { id: 2, title: "Normalizing State", platformId: 2, likes: 5 },
  { id: 3, title: "Selectors 101", platformId: 1, likes: 1 },
];
let _nextId = 4;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const fetchPostsApi = async () => {
  await delay(600);
  return [..._posts];
};

export const createPostApi = async (post) => {
  await delay(400);
  const newPost = { id: _nextId++, likes: 0, ...post };
  _posts.push(newPost);
  return newPost;
};

export const deletePostApi = async (id) => {
  await delay(300);
  _posts = _posts.filter((p) => p.id !== id);
  return id;
};
