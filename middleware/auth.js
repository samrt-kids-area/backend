const jwt = require("jsonwebtoken");

const authenticated = async (req, res, next) => {
  try {
    // Check if the authorization header exists
    const authHeader = req.header("authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    // Verify the token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Attach the user to the request object
    console.log("Authenticated user:", user);
    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { authenticated };
