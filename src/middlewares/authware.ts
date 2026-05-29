import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

export interface AuthRequest extends Request {
  user?: {
    id: string
  }
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: "No token" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
    }

    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}