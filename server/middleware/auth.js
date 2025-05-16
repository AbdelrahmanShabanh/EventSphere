import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Authentication required",
        details: "No authorization header provided",
      });
    }

    // Extract token from header
    const authHeader = req.headers.authorization;
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    // Validate token exists
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        details: "No token provided",
      });
    }

    // Verify token
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Set user data on request object
      req.userId = decodedToken.userId;
      req.userRole = decodedToken.role;

      // Continue to next middleware/route handler
      next();
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired",
          details: "Your session has expired. Please log in again.",
        });
      } else if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token",
          details: "The provided token is malformed or invalid",
        });
      } else {
        // Other JWT errors
        return res.status(401).json({
          message: "Token verification failed",
          details: jwtError.message,
        });
      }
    }
  } catch (error) {
    // Unexpected errors
    console.error("Auth middleware error:", error);
    res.status(500).json({
      message: "Authentication error",
      details: "An unexpected error occurred during authentication",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
