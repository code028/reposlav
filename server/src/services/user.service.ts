import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import useragent from "useragent"

// Types
import {
    ILoginUser,
    IRegisterUser,
} from "../types/user";

import { prisma } from "../../prisma/client";
import newError from "../utils/newError";

export const registerUser = async (userData: IRegisterUser) => {
    const { name, username, email, password } = userData;

    // Check if user exist in db 
    const user = await prisma.users.findFirst({
        where: {
            OR: [{ username }, { email }]
        }
    });

    if (user) newError(400, "Bad request | USER EXIST!");

    const hashPassword = await bcrypt.hash(password, parseInt(`${process.env.SALT}`))

    // Create new user
    const newUser = await prisma.users.create({
        data: {
            name,
            username,
            email,
            password: hashPassword
        }
    });

    const { password: pass, ...fields } = newUser;
    return fields;
}

export const loginUser = async (userData: ILoginUser, userAgent: string) => {
    const { login, password } = userData;

    const user = await prisma.users.findFirst({
        where: {
            OR: [{ email: login }, { username: login }]
        }
    });

    // User doesn`t exist 
    if (!user) newError(404, "Invalid credentials");

    const passwordMatch = await bcrypt.compare(password, user?.password!);

    // Password is incorrect
    if (!passwordMatch) newError(404, "Invalid credentials");

    // Sign Access and Refresh Token 
    const accessToken = jwt.sign({ id: user?.id, email: user?.email, role: user?.role }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE });
    const refreshToken = jwt.sign({ id: user?.id, email: user?.email, role: user?.role }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE });

    // UserAgent Information
    const agent = useragent.parse(userAgent);

    // Create new session
    const newSession = await prisma.sessions.create({
        data: {
            userId: user?.id!,
            userAgent,
            active: true,
            refreshToken,
            browser: agent.toAgent(),
            os: agent.os.toString(),
            device: agent.device.toString(),
        }
    });

    // Formated response
    const { userId, refreshToken: refresh, browser, os, device } = newSession;

    const response = {
        userId,
        username: user?.name,
        email: user?.email,
        role: user?.role,
        accessToken,
        refreshToken,
    }

    return response;
}

export const logoutUser = async (refreshToken: string, userAgent: string) => {

    const session = await prisma.sessions.findFirst({
        where: {
            refreshToken,
            userAgent
        }
    });

    if (!session) newError(404, "User is not logged in");

    const updatedSession = await prisma.sessions.update({
        where: {
            id: session?.id
        },
        data: {
            active: false
        }
    });

    return updatedSession;
}

export const createNewAccessToken = async (refreshToken: string, userAgent: string) => {
    
    // Does user is logged in
    const session = await prisma.sessions.findFirst({
        where: {
            refreshToken,
            userAgent,
            active: true
        }
    });

    if (!session) newError(401, "User is not logged in");
    
    // Check if refresh token is valid
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);

    const user = await prisma.users.findUnique({
        where: {
            // @ts-ignore
            email: (decoded as any).email
        }
    });

    if (!user) newError(404, "User doesn`t exist");

    const accessToken = jwt.sign(
        { id: user?.id, email: user?.email, role: user?.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    return { accessToken };
}

export const getUserRole = async (id: number) => {
    const userExist = await prisma.users.findFirst({
        where: {
            id
        }
    });

    if (!userExist) newError(404, "User doesn`t exist");
    return {role: userExist?.role};
}

export const getUserById = async (id: number, refreshToken: string) => {
    const userExist = await prisma.users.findFirst({
        where: {
            id
        }
    });
    
    const currentSession = await prisma.sessions.findFirst({
        where: {
            refreshToken
        }
    })

    if (!userExist) newError(404, "User doesn`t exist");
    
    const user = {
        id: userExist?.id,
        name: userExist?.name,
        username: userExist?.username,
        email: userExist?.email,
        createdAt: userExist?.createdAt,
        lastSeen: currentSession?.createdAt
    }

    return {user,session: currentSession};
}