import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["Innovator", "Mentor", "Investor"],
      default: "Innovator",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    // 🌟 Extended Details (Optional)
    skills: {
      type: [String],
      default: [],
    },

    domain: {
      type: String,
      default: "", // e.g., AI, HealthTech, SaaS
    },

    experience: {
      type: String,
      default: "", // e.g., "5 years Startup Founder"
    },

    organization: {
      type: String,
      default: "",
    },

    budgetRange: {
      type: String,
      default: "", // Investors: "₹10L–₹1Cr"
    },

    linkedin: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
