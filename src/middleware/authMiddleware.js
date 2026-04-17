  
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};


const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};

export { protect,admin };
