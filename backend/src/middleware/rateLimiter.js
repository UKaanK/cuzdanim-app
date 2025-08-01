import rateLimit from "../config/upstash.js";
const rateLimiter= async(req,res,next)=>{
    try{
        const userIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const {success}=await rateLimit.limit("my-rate-limit")
        if(!success){
            return res.status(429).json({
                messages:"Too many request,please try again later"
            })
        }
        next()
    }catch(error){
        console.log("Rate Limit Error:",error)
        next(error)
    }
}

export default rateLimiter;