import express from "express";
import { Post } from "../models/Post.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/posts
 * Create text-only post
 */
router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.json({
        success: false,
        message: "Post content cannot be empty",
      });
    }

    const post = await Post.create({
      author: req.user._id,
      content: content.trim(),
    });

    // populate minimal author fields for frontend
    await post.populate("author", "name role");

    return res.json({ success: true, post });
  } catch (err) {
    console.error("Create post error", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create post" });
  }
});

/**
 * GET /api/posts
 * List posts (newest first, paginated)
 */
router.get("/", auth, async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .populate("author", "name role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({ success: true, posts });
  } catch (err) {
    console.error("List posts error", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch posts" });
  }
});

/**
 * POST /api/posts/:id/like
 * Toggle like / unlike
 */
router.post("/:id/like", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post)
      return res.json({ success: false, message: "Post not found" });

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    console.error("Like post error", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to toggle like" });
  }
});

/**
 * POST /api/posts/:id/comments
 * Simple comment (non realtime)
 */
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim())
      return res.json({
        success: false,
        message: "Comment cannot be empty",
      });

    const post = await Post.findById(req.params.id);
    if (!post)
      return res.json({ success: false, message: "Post not found" });

    post.comments.push({
      user: req.user._id,
      content: content.trim(),
    });

    await post.save();
    return res.json({ success: true });
  } catch (err) {
    console.error("Comment error", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add comment" });
  }
});

export default router;
