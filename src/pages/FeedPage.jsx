// src/pages/FeedPage.jsx
import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import CreatePost from "../components/CreatePost";
import PostItem from "../components/PostItem";
import SkeletonPost from "../components/SkeletonPost";
import postsData from "../data/feedPosts";
import api from "../api/axios";

export default function FeedPage({ user }) {
  const STORAGE_KEY = "udaan_feed_posts_v1";
  const FOLLOWED_KEY = "udaan_followed_v1";

  // posts state (localStorage fallback)
  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return postsData || [];
  });

  // followed authors (array of authorIds/handles)
  const [followed, setFollowed] = useState(() => {
    try {
      const raw = localStorage.getItem(FOLLOWED_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  // helper: stable id for author (use authorId, fallback to handle, fallback to author name)
  const getAuthorKey = (p) => p?.authorId ?? p?.handle ?? p?.author ?? "";

  // persist followed set
  useEffect(() => {
    try {
      localStorage.setItem(FOLLOWED_KEY, JSON.stringify(followed));
    } catch (e) {}
  }, [followed]);

  // load posts from backend once (fallback to local postsData)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/posts?limit=50").catch(() => null);
        if (!mounted) return;
        if (res && Array.isArray(res.data)) {
          setPosts(res.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        } else {
          setPosts(prev => (prev && prev.length ? prev : (postsData || [])));
        }
      } catch (err) {
        console.log("Backend posts unavailable, using local posts", err);
        setPosts(prev => (prev && prev.length ? prev : (postsData || [])));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist posts to localStorage whenever posts change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {}
  }, [posts]);

  // optimistic post handling (same as before)
  const handlePostCreated = (createdOrNull, tempId) => {
    if (!createdOrNull && tempId) {
      setPosts(prev => prev.filter(p => p.id !== tempId));
      return;
    }
    if (createdOrNull && createdOrNull.isTemp) {
      setPosts(prev => [createdOrNull, ...prev]);
      return;
    }
    if (createdOrNull && tempId) {
      setPosts(prev => prev.map(p => p.id === tempId ? createdOrNull : p));
      return;
    }
    if (createdOrNull) {
      setPosts(prev => [createdOrNull, ...prev]);
    }
  };

  // local sync when a post is liked
  const handleLikeLocal = (postId, liked) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likedByMe: liked, likes: (p.likes ?? 0) + (liked ? 1 : -1) } : p
    ));
  };

  // follow toggle handler: toggles author key in followed list
  const onFollowToggle = (authorKey, isFollowing) => {
    setFollowed(prev => {
      const exists = prev.includes(authorKey);
      if (isFollowing && !exists) return [...prev, authorKey];
      if (!isFollowing && exists) return prev.filter(a => a !== authorKey);
      return prev;
    });
  };

  // build filteredPosts based on activeFilter
  const filteredPosts = posts.filter(p => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Following") {
      const key = getAuthorKey(p);
      return followed.includes(key);
    }
    return p.role === activeFilter;
  });

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SkeletonPost />
      <div className="mt-4"><SkeletonPost /></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      <Card className="mb-8">
        <CreatePost user={user} onPostCreated={handlePostCreated} />
      </Card>

      <div className="flex gap-4 mb-6">
        {["All", "Following", "Innovators", "Mentors", "Investors"].map(f => (
          <button
            key={f}
            className={`px-4 py-2 rounded-full text-sm border ${activeFilter === f ? "bg-[#2F2F2F] text-white" : "bg-white text-gray-500"}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredPosts.length === 0 && <div className="text-center text-gray-500">No posts yet</div>}
        {filteredPosts.map(post => {
          const authorKey = getAuthorKey(post);
          return (
            <PostItem
              key={post.id}
              post={post}
              onLikeLocal={handleLikeLocal}
              // pass initialFollowing so PostItem/FollowButton can render correctly
              initialFollowing={followed.includes(authorKey)}
              // provide a callback that accepts (authorKeyFromChild, isFollowing)
              onFollowToggle={(authorKeyFromChild, isFollowing) => {
                const k = authorKeyFromChild || authorKey;
                onFollowToggle(k, isFollowing);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
