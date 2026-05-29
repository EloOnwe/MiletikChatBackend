import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Token not found" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: string}

    if (!decoded) {
      return res.status(403).json({ message: "Forbidden" })
    }

    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export default protect