import rateLimit from "express-rate-limit";

export const webhookLimiter=rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 5 requests per `window` (here, per minute)
    message:{error:"Too many requests, please try again later."}, 
})
export const endpointLimiter=rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, 
    message:{error:"Too many requests, please try again later."}, 
})