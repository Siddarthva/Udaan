// src/components/FollowButton.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
let toast;
try { toast = require('react-hot-toast').default; } catch (e) { toast = null; }

export default function FollowButton({ userId, initialFollowing = false, onToggle }) {
  const [following, setFollowing] = useState(!!initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // keep internal state in sync if parent changes initialFollowing
    setFollowing(!!initialFollowing);
  }, [initialFollowing]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);

    const prev = following;
    const newState = !prev;

    // optimistic update
    setFollowing(newState);
    try {
      // call backend if available; prefer POST for follow and DELETE for unfollow
      if (newState) {
        await api.post(`/users/${userId}/follow`).catch((err) => { throw err; });
      } else {
        await api.delete(`/users/${userId}/follow`).catch((err) => { throw err; });
      }

      // success -> notify parent (authorKey, isFollowing)
      onToggle && onToggle(userId, newState);
      if (toast) toast.success(newState ? "Following" : "Unfollowed");
    } catch (err) {
      // rollback on error
      setFollowing(prev);
      console.error("Follow API failed:", err);
      // notify parent of rollback (keep parent consistent)
      onToggle && onToggle(userId, prev);
      // show non-blocking notification if toast available
      if (toast) {
        toast.error("Could not update follow (saved locally).");
      } else {
        // optional: silent fallback — comment out if you want alert
        // alert("Failed to update follow");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-3 py-1 rounded ${following ? "bg-gray-800 text-white" : "border border-gray-400 text-gray-700"} ${loading ? "opacity-70" : ""}`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
