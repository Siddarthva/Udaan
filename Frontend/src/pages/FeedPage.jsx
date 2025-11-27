import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

// 👉 Plain array, NO useState here
const initialPosts = [
  {
    id: 1,
    name: "Aarav Patel",
    handle: "@aarav_innovates",
    role: "Innovator",
    text: "Just reached 70% funding goal! 🚀",
    likes: 245,
    comments: 42,
    shares: 18,
  },
];

const FILTERS = ["All", "Innovators", "Mentors", "Investors"];

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState(initialPosts);  // ✅ proper initial value
  const [newPost, setNewPost] = useState("");

  const visiblePosts = posts.filter((p) =>
    activeFilter === "All" ? true : p.role === activeFilter.slice(0, -1)
  );

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  const handleComment = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, comments: p.comments + 1 } : p
      )
    );
  };

  const handleShare = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, shares: p.shares + 1 } : p
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      name: "You",
      handle: "@you",
      role: "Innovator",
      text: newPost.trim(),
      likes: 0,
      comments: 0,
      shares: 0,
    };
    setPosts((prev) => [post, ...prev]);
    setNewPost("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Create post */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
          U
        </div>
        <input
          type="text"
          placeholder="Share something..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700"
        />
        <button
          onClick={handleCreatePost}
          className="px-4 py-2 rounded-xl bg-[#2F2F2F] text-white text-sm shadow-sm hover:bg-black transition"
        >
          Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              activeFilter === f
                ? "bg-[#2F2F2F] text-white border-[#2F2F2F]"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-5">
        {visiblePosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5"
          >
            <header className="mb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                  {post.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {post.name}
                  </div>
                  <div className="text-xs text-gray-500">{post.handle}</div>
                </div>
              </div>
            </header>

            <p className="text-sm text-gray-800 mb-4">{post.text}</p>

            {/* Grey milestone placeholder (optional) */}
            <div className="h-40 w-full rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-semibold text-gray-300 mb-4">
              Milestone
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1 hover:text-gray-800"
              >
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={() => handleComment(post.id)}
                className="flex items-center gap-1 hover:text-gray-800"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </button>
              <button
                onClick={() => handleShare(post.id)}
                className="flex items-center gap-1 hover:text-gray-800"
              >
                <Share2 className="w-4 h-4" />
                <span>{post.shares}</span>
              </button>
            </div>
          </article>
        ))}

        {visiblePosts.length === 0 && (
          <p className="text-sm text-gray-500 mt-6">
            No posts yet in this filter.
          </p>
        )}
      </div>
    </div>
  );
}
