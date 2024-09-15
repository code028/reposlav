import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface roleGuardTypes {
    requiredRoles: string[],
    middlewares?: Array<(req: Request, res: Response, next: NextFunction) => void>
}

const roleGuard = ({ requiredRoles, middlewares }: roleGuardTypes) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { role: string };

      if (!requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      if (middlewares) {
        middlewares.forEach((middleware) => middleware(req, res, next));
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  };
};

export default roleGuard;