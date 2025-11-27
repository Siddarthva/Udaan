import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token, auth denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error", err);
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid" });
  }
};
