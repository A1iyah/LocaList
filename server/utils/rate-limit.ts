import rateLimit from "express-rate-limit";

const rateLimitOptions = {
  windowMs: 5000,
  max: 55,
  message: "API rate limit exceeded. Please try again later.",
};

export const rateLimitMiddleware = rateLimit(rateLimitOptions);
