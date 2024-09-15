import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
      // @ts-ignore
      req.user = decoded;
      return next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken || localStorage.getItem('refreshToken');

        if (!refreshToken) {
          return res.status(401).json({ message: 'Refresh token is required.' });
        }

        try {
          const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);

          const response = await axios.post(`${process.env.SERVER_URL}/auth/refresh`, { refreshToken });

          accessToken = response.data.accessToken;

          // Ažuriraj Authorization header sa novim access tokenom
          req.headers.authorization = `Bearer ${accessToken}`;

          const decodedNewAccess = jwt.verify(accessToken!, process.env.ACCESS_TOKEN_SECRET as string);
          // @ts-ignore
          req.user = decodedNewAccess;

          return next();
        } catch (refreshError) {
          return res.status(403).json({ message: 'Refresh token expired or invalid. Please log in again.' });
        }
      } else {
        return res.status(401).json({ message: 'Invalid access token.' });
      }
    }
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized access.' });
  }
};

export default authGuard;
