// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
}
