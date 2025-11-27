
// src/components/SkeletonPost.jsx
import React from "react";

export default function SkeletonPost() {
  return (
    <div className="border rounded-xl p-4 animate-pulse bg-white shadow-sm">
      {/* Name placeholder */}
      <div className="h-4 w-32 bg-gray-300 rounded mb-3"></div>

      {/* Handle placeholder */}
      <div className="h-3 w-20 bg-gray-200 rounded mb-4"></div>

      {/* Post content placeholder */}
      <div className="h-20 bg-gray-200 rounded mb-3"></div>

      {/* Buttons placeholder */}
      <div className="flex gap-4">
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
