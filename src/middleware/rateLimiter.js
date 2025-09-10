import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // Allow health checks without limits
    if (req.path === "/api/health") return next();

    // Build a more granular key: per IP + method + path
    const ip = (req.headers["x-forwarded-for"] || req.ip || "unknown").toString();
    const key = `rl:${ip}:${req.method}:${req.baseUrl}${req.path}`;

    const { success, limit, remaining, reset } = await ratelimit.limit(key);
    if (!success) {
      return res.status(429).json({
        message: "Too many requests",
        limit,
        remaining,
        reset,
      });
    }
    next();
  } catch (error) {
    console.log("rate limit error", error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

export default rateLimiter;