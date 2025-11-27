import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

// GET /api/users/me  (protected)
export const getMe = async (req, res) => {
  return res.json(req.user); // set in auth middleware
};

// GET /api/users/:id  (public profile)
export const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("name role bio createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("Get public profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/me  (protected)  – update name + bio
export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name && !bio) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    if (name) req.user.name = name;
    if (typeof bio === "string") req.user.bio = bio;

    await req.user.save();

    return res.json({
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      bio: req.user.bio,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/me/password  (protected)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current & new password required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
