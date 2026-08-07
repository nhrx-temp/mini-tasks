const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "temp_secret_key";

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token)
    return res.status(401).json({ error: "Unauthorized"} );

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { userId, username }
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authRequired;
