// src/components/CommentsModal.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function CommentsModal({ postId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    const loadComments = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/posts/${postId}/comments`).catch(() => null);

        if (mounted) {
          setComments(res && Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Failed to load comments", err);
        if (mounted) setComments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadComments();

    return () => {
      mounted = false;
    };
  }, [open, postId]);

  const submitComment = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${postId}/comments`, { text: trimmed }).catch(() => null);

      const created =
        (res && res.data) || {
          id: `local-${Date.now()}`,
          text: trimmed,
          author: { name: "You" },
          createdAt: new Date().toISOString(),
        };

      setComments((prev) => [created, ...prev]);
      setText("");
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />

      {/* modal */}
      <div className="relative max-w-2xl w-full">
        <Card>
          {/* header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Comments</h3>
            <button className="text-gray-500" onClick={onClose}>Close</button>
          </div>

          {/* input */}
          <div className="mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full border rounded p-2"
              placeholder="Write a comment..."
            />
            <div className="flex justify-end mt-2">
              <Button disabled={submitting} onClick={submitComment}>
                {submitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>

          {/* comments */}
          <div className="max-h-64 overflow-auto space-y-3">
            {loading && <div className="text-sm text-gray-500">Loading comments...</div>}

            {!loading && comments.length === 0 && (
              <div className="text-sm text-gray-500">No comments yet</div>
            )}

            {comments.map((c) => (
              <div key={c.id} className="border rounded p-2">
                <div className="font-bold text-sm">{c.author?.name ?? "Unknown"}</div>
                <div className="text-gray-700 text-sm">{c.text}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt || c.created_at || Date.now()).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
