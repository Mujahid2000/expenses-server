import jwt from "jsonwebtoken";
import User from "../models/User.js";



export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    // console.log(auth)
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id name email");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid/expired token" });
  }
};
