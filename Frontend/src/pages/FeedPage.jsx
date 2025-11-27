import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Heart, MessageSquare } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

export default function FeedPage({ user }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPosts(data.posts);
      else setError(data.message || "Failed to load posts");
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPosts();
  }, [token]);

  // Create Post
  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setError("");

    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ content: newPost }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to create post");
        return;
      }
      setNewPost("");
      // Prepend new post
      setPosts((prev) => [data.post, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to create post");
    }
  };

  // Like / Unlike
  const toggleLike = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) return;

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: updateLikesArray(p.likes, user?._id, data.liked),
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateLikesArray = (likesArr, userId, liked) => {
    if (!userId) return likesArr;
    const exists = likesArr.some((id) => id === userId);
    if (liked && !exists) return [...likesArr, userId];
    if (!liked && exists) return likesArr.filter((id) => id !== userId);
    return likesArr;
  };

  const hasLiked = (post) => {
    if (!user) return false;
    return post.likes?.some((id) => id === user._id);
  };

  return (
    <div className="max-w-3xl mx-auto pt-28 px-4 pb-16">
      {/* Create Post */}
      <Card className="mb-6 p-5">
        <h2 className="font-semibold mb-3 text-lg">Share an update</h2>
        <textarea
          className="w-full border rounded-xl p-3 mb-3 resize-none"
          rows="3"
          placeholder={
            user
              ? "What are you working on today?"
              : "Login to share your milestone…"
          }
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          disabled={!user}
        />
        {error && (
          <p className="text-sm text-red-500 mb-2 text-center">{error}</p>
        )}
        <div className="flex justify-end">
          <Button
            onClick={handleCreatePost}
            disabled={!user}
            className="px-6"
          >
            Post
          </Button>
        </div>
      </Card>

      {/* Feed */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        <div className="space-y-4 overflow-y-auto">
          {posts.map((post) => (
            <Card key={post._id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">
                    {post.author?.name || "Unknown User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {post.author?.role} •{" "}
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-gray-900 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                {/* Like Button */}
                <button
                  className={`flex items-center gap-2 ${
                    hasLiked(post) ? "text-red-500" : "hover:text-black"
                  }`}
                  onClick={() => toggleLike(post._id)}
                  disabled={!user}
                >
                  <Heart
                    size={18}
                    fill={hasLiked(post) ? "currentColor" : "none"}
                  />
                  <span>{post.likes?.length || 0}</span>
                </button>

                {/* Comments (non-realtime for now) */}
                <button className="flex items-center gap-2 hover:text-black">
                  <MessageSquare size={18} />
                  <span>{post.comments?.length || 0} Comments</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
