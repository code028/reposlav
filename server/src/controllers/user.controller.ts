import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Services
import { 
    loginUser, 
    logoutUser, 
    createNewAccessToken, 
    registerUser, 
    getUserRole
} from "../services/user.service";

// Validations
import { formatValidationErrors } from "../utils/validation";
import newError from "../utils/newError";
import axios from "axios";

export const handleRegister = async (req: Request, res: Response) => {
    try {
        // Validate request fields
        const formattedErrors = formatValidationErrors(req);
        if (formattedErrors.length > 0) return res.status(400).json({ errors: formattedErrors });
        
        const user = { ...req.body };
        const response = await registerUser(user);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
};

export const handleLogin = async (req: Request, res: Response) => { 
    try {
        // Validate request fields
        const formattedErrors = formatValidationErrors(req);
        if (formattedErrors.length > 0) return res.status(400).json({ errors: formattedErrors });

        const user = { ...req.body };
        const userAgent = req.headers['user-agent']!;

        const response = await loginUser(user, userAgent);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleLogout = async (req: Request, res: Response) => {
    try {
        // Validate request fields
        const formattedErrors = formatValidationErrors(req);
        if (formattedErrors.length > 0) return res.status(400).json({ errors: formattedErrors });

        const { refreshToken } = req.body;
        const userAgent = req.headers['user-agent']!;

        const response = await logoutUser(refreshToken, userAgent);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleRefresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    try {
        // Validate request fields
        const formattedErrors = formatValidationErrors(req);
        if (formattedErrors.length > 0) return res.status(400).json({ errors: formattedErrors });
        
        const { refreshToken } = req.body;
        const userAgent = req.headers['user-agent']!;
        
        const response = await createNewAccessToken(refreshToken, userAgent);
        return res.send(response);
    
    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({status:403, message: "Refresh Token has expired"});
        }
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetUserRole = async (req: Request, res: Response) => {
    try {
        const {id} =  req.params;
        const parsedId = parseInt(`${id}`);
        const response = await getUserRole(parsedId);
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
} 