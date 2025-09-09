import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
const {success} = await ratelimit.limit("my-rate-limit");
 if(!success){
    return res.status(429).json({message: "Too many requests"});
 }
next();
    }
    
    catch (error) {
        console.log("rate limit error", error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }}
export default rateLimiter;