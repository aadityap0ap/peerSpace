import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Token Missing!"
        });
    }

    try {
        // Authorization: Bearer <token>
        const token = authHeader.split(" ")[1]!;
        const decoded = jwt.verify(
            token,
            process.env.JWT_USER_PASSWORD as string
        ) as JwtPayload;
        (req as any).userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token Provided!"
        });
    }
}