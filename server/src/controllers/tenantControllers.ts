import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response) => {
    try {
        const { cognitoId } = req.params;
        const tenant = await prisma.tenant.findUnique({
            where: { cognitoId: cognitoId as string },
            include: {
                favorites: true,
            }
        });
        if(tenant) {
            res.json(tenant)
        } else {
            res.status(404).json({ message: "Tenant not found" });
        }
    } catch (error) {
        console.error("Error fetching tenant:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createTenant = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { cognitoId, name, email, phoneNumber } = req.body;
        const tenant = await prisma.tenant.create({
            data: { cognitoId, name, email, phoneNumber },
        });
        res.status(201).json(tenant);
    } catch (error) {
        console.error("Error creating tenant:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}