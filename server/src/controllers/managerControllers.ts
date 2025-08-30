import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prismaClient = new PrismaClient();
export const getManager = async (req: Request, res: Response) => {
    const { cognitoId } = req.params; 
    try {
        const manager = await prismaClient.manager.findUnique({
            where: {
                cognitoId: cognitoId as string
            },
            include: {
                managedProperties: true
            }
        })
        if (!manager) {
            return res.status(404).json({ message: "Manager not found" });
        }
        res.status(200).json(manager);
    } catch (error) {
        res.status(500).json({ message: "Error fetching manager", error: error });
    }
}

export const createManager = async (req: Request, res: Response) => {
    const { cognitoId, name, email, phone } = req.body;
    try {
        const manager = await prismaClient.manager.create({
            data: {
                cognitoId,
                name,
                email,
                phoneNumber: phone,
            },
        });
        res.status(201).json(manager);
    } catch (error) {
        res.status(500).json({ message: "Error creating manager", error: error });
    }
}