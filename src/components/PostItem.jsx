// src/components/PostItem.jsx
import React, { useState } from "react";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/axios";
import Card from "./ui/Card";
import CommentsModal from "./CommentsModal";
import FollowButton from "./FollowButton";

export default function PostItem({ post, onLikeLocal, onFollowToggle, initialFollowing }) {
  // defensive defaults
  const initialLiked = !!(post && post.likedByMe);
  const initialLikes = (post && (post.likes ?? post.likeCount ?? 0)) || 0;

  const [localLiked, setLocalLiked] = useState(initialLiked);
  const [localLikes, setLocalLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  // Toggle like with optimistic UI and rollback on error
  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);

    const prevLiked = localLiked;
    const prevCount = localLikes;

    // optimistic update
    const newLiked = !prevLiked;
    setLocalLiked(newLiked);
    setLocalLikes((c) => c + (newLiked ? 1 : -1));
    if (onLikeLocal) onLikeLocal(post.id, newLiked);

    try {
      if (newLiked) {
        const res = await api.post(`/posts/${post.id}/like`).catch(() => null);
        if (res?.data?.likes != null) setLocalLikes(res.data.likes);
      } else {
        const res = await api.delete(`/posts/${post.id}/like`).catch(() => null);
        if (res?.data?.likes != null) setLocalLikes(res.data.likes);
      }
    } catch (err) {
      // rollback
      setLocalLiked(prevLiked);
      setLocalLikes(prevCount);
      if (onLikeLocal) onLikeLocal(post.id, prevLiked);
      console.error("Like API failed", err);
    } finally {
      setTimeout(() => setLoading(false), 150);
    }
  };

  if (!post) return null;

  // compute a stable author key (use authorId when available, otherwise handle, otherwise author name)
  const authorKey = post.authorId || post.handle || post.author || null;
  // determine whether this author is initially followed (parent can override by passing initialFollowing prop)
  const followedInitial = typeof initialFollowing !== "undefined" ? initialFollowing : !!post.initialFollowing;

  return (
    <>
      <Card className={`${post.isTemp ? "opacity-70" : ""}`}>
        <div className="flex justify-between">
          <div>
            <p className="font-bold">{post.author ?? "Unknown"}</p>
            <p className="text-xs text-gray-500">{post.handle ?? ""}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Always show FollowButton if we have any author key (authorId / handle / author) */}
            {authorKey && (
              <FollowButton
                userId={authorKey}
                initialFollowing={followedInitial}
                onToggle={(isFollowing) => {
                  // bubble up authorKey + isFollowing to parent
                  onFollowToggle && onFollowToggle(authorKey, isFollowing);
                }}
              />
            )}

            <MoreHorizontal className="text-gray-400" />
          </div>
        </div>

        <p className="mt-4">{post.content ?? post.text ?? ""}</p>

        {post.image && (
          <img src={post.image} className="mt-4 rounded-xl max-h-96 w-full object-cover" alt="post" />
        )}

        <div className="flex gap-6 mt-4 text-gray-500 items-center">
          <motion.button
            onClick={toggleLike}
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded px-3 py-2 bg-white border"
            aria-pressed={localLiked}
            aria-label="like"
            title={localLiked ? "Unlike" : "Like"}
          >
            <motion.span
              animate={{ scale: localLiked ? 1.15 : 1, rotate: localLiked ? -8 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            >
              <Heart size={18} className={localLiked ? "text-red-500" : ""} />
            </motion.span>
            <span>{localLikes}</span>
          </motion.button>

          <button
            onClick={() => setCommentsOpen(true)}
            className="flex items-center gap-2 text-gray-600"
            aria-label="comments"
            title="Comments"
          >
            <MessageSquare size={18} />
            <span>{post.comments ?? 0}</span>
          </button>

          <button className="flex items-center gap-2 text-gray-600" aria-label="share" title="Share">
            <Share2 size={18} />
          </button>
        </div>
      </Card>

      <CommentsModal open={commentsOpen} postId={post.id} onClose={() => setCommentsOpen(false)} />
    </>
  );
}
