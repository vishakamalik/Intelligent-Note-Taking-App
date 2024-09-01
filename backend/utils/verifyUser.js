import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // const token = req.cookies.access_token
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2IyYTFjOWQwMTg1YmZiNTJmYWNjNiIsImlhdCI6MTcyNTA5ODQxOX0.9yw3BotR5qRfdW0vFhOp8zVPgIP74ZoCqfY9VfFv56Y";

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }

    req.user = user;
    next();
  });
};
