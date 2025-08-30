import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface DecodedToken extends JwtPayload {
    sub: string;
    "custom:role"?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            }
        }
    }
}

export const authMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        try {
            const decoded = jwt.decode(token) as DecodedToken;
            const userRole = decoded["custom:role"] || "";
            req.user = {
                id: decoded.sub,
                role: userRole,
            }

            const hasAccess = allowedRoles.includes(userRole.toLowerCase());
            if (!hasAccess) {
                res.status(403).json({ message: "Forbidden" });
                return;
            }
            next();
        } catch (error) {
            console.error("Failed to decode token:", error)
            res.status(401).json({ message: "Unauthorized" });
        }
    }
}