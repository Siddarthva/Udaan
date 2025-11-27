import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import postsData from "../data/feedPosts";
import { MoreHorizontal, Heart, MessageSquare, Share2, Image as ImageIcon } from "lucide-react";

export default function FeedPage({ user }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState(postsData);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      <Card className="mb-8">
        <div className="flex gap-4">
          <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
            {user ? user.avatar : "G"}
          </div>
          <textarea className="flex-1 resize-none" placeholder="Share something..." />
          <Button>Post</Button>
        </div>
      </Card>

      <div className="flex gap-4 mb-6">
        {["All", "Innovators", "Mentors", "Investors"].map(f => (
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
        {posts.map(post => (
          <Card key={post.id}>
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{post.author}</p>
                <p className="text-xs text-gray-500">{post.handle}</p>
              </div>
              <MoreHorizontal className="text-gray-400" />
            </div>
            <p className="mt-4">{post.content}</p>
            {post.image && <img src={post.image} className="mt-4 rounded-xl" />}
            <div className="flex gap-6 mt-4 text-gray-500">
              <Heart size={18} /> {post.likes}
              <MessageSquare size={18} /> {post.comments}
              <Share2 size={18} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
