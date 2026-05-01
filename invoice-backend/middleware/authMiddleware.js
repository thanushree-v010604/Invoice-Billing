const admin = require('../firebaseAdmin');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "No token provided" });
    }

    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Invalid authorization header format" });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = decoded;
      next();
    } catch (verifyError) {
      console.error('Token verification error:', verifyError.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(500).json({ error: "Authentication error" });
  }
};