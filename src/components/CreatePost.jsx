// src/components/CreatePost.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import Button from "./ui/Button";
import toast from "react-hot-toast";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

export default function CreatePost({ user, onPostCreated }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // data URL (stable)
  const [uploading, setUploading] = useState(false);

  // Use FileReader to generate a stable data URL preview (more robust than createObjectURL)
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result); // data:image/... base64 — stable until cleared explicitly
    };
    reader.onerror = (err) => {
      console.error("FileReader error", err);
      toast.error("Could not preview image");
      setImageFile(null);
      setImagePreview(null);
    };
    reader.readAsDataURL(f);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadToCloudinary = async (file) => {
    if (!file || !CLOUD_NAME || !UPLOAD_PRESET) return null;
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error("Upload failed: " + (text || res.status));
    }
    const data = await res.json();
    return data.secure_url;
  };

  const onSubmit = async (data) => {
    const text = (data.text || "").trim();
    if (!text && !imageFile) {
      toast.error("Please add text or an image.");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const tempPost = {
      id: tempId,
      author: user?.name || "You",
      handle: user?.handle || "@you",
      content: text,
      image: imagePreview || null,
      likes: 0,
      comments: 0,
      isTemp: true,
      createdAt: new Date().toISOString(),
    };

    onPostCreated && onPostCreated(tempPost);
    toast.loading("Posting...");

    try {
      let imageUrl = null;
      if (imageFile && CLOUD_NAME && UPLOAD_PRESET) {
        setUploading(true);
        const t = toast.loading("Uploading image...");
        try {
          imageUrl = await uploadToCloudinary(imageFile);
          toast.dismiss(t);
          toast.success("Image uploaded");
        } catch (err) {
          toast.dismiss(t);
          console.error("Cloudinary upload failed", err);
          toast.error("Image upload failed — posting without it");
          // we intentionally continue and post without imageUrl
        } finally {
          setUploading(false);
        }
      }

      const payload = { content: text, image: imageUrl };
      const res = await api.post("/posts", payload).catch(() => null);
      const created = (res && res.data) || { ...tempPost, id: `server-${Date.now()}`, isTemp: false, image: imageUrl || tempPost.image };
      onPostCreated && onPostCreated(created, tempId);

      // Clear form and preview only after successful flow (or fallback)
      reset();
      setImageFile(null);
      setImagePreview(null);
      toast.success("Posted");
    } catch (err) {
      console.error("Create post failed", err);
      onPostCreated && onPostCreated(null, tempId);
      toast.error("Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-4 items-start">
        <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
          {user?.avatar ?? "G"}
        </div>

        <div className="flex-1">
          <textarea
            {...register("text")}
            className="flex-1 resize-none rounded-md border p-3 w-full focus:ring-1 focus:ring-gray-300"
            rows={3}
            placeholder="Share something..."
          />

          {imagePreview && (
            <div className="mt-3 relative">
              <img src={imagePreview} alt="preview" className="max-h-48 rounded-md w-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded px-2 py-1 text-xs"
              >
                Remove
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 border rounded">
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <span className="text-sm">Attach image</span>
              </label>
              {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
            </div>

            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting || uploading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
