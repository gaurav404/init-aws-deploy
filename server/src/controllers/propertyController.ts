import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const prismaClient = new PrismaClient();
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
} as S3ClientConfig);

export const getProperty = async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const property = await prismaClient.property.findUnique({
        where: { id: Number(propertyId) },
    });
    res.json(property);
};

export const getPropertiesForManager = async (req: Request, res: Response) => {
    const cognitoId = req.params.cognitoId;
    if (!cognitoId) {
        return res.status(400).json({ error: "server issue" });
    }
    const manager = await prismaClient.manager.findUnique({
        where: { cognitoId },
        include: {
            managedProperties: true,
        },
    });

    if (!manager) {
        return res.status(400).json({ error: "server issue" });
    }

    res.json({
        properties: manager.managedProperties
    });

}

export const getProperties = async (req: Request, res: Response) => {
    try {
        const { 
            favoriteIds, 
            priceMin, 
            priceMax,
            beds,
            squareFeetMin,
            squareFeetMax,
            propertyType,
            amenities,
            availableFrom,
            latitude,
            longitude
        } = req.query;

        const whereConditions: Prisma.Sql[] = [];
        if(favoriteIds) {
            whereConditions.push(
                Prisma.sql`p.id IN (${Prisma.join(favoriteIds.toString().split(',').map(Number))})`
            );
        }
        if(priceMin) {
            whereConditions.push(Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`);
        }
        if(priceMax) {
            whereConditions.push(Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`);
        }
        if(beds && beds!=="any") {
            whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
        }
        if(squareFeetMin) {
            whereConditions.push(Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`);
        }
        if(squareFeetMax) {
            whereConditions.push(Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`);
        }
        if(propertyType && propertyType!=="any") {  
            whereConditions.push(Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`);
        }
        if(amenities && amenities !== "any") {
            const amenitiesArray = amenities.toString().split(',');
            whereConditions.push(Prisma.sql`p."amenities" @> ${amenitiesArray}`);
        }
        if(availableFrom && availableFrom!=="any") {
            const availableFromDate = typeof availableFrom === 'string' ? new Date(availableFrom) : null;
            if(availableFromDate && !isNaN(availableFromDate.getTime())) {
                whereConditions.push(
                    Prisma.sql`EXISTS (
                        SELECT 1 FROM "Lease" l
                        WHERE l."propertyId" = p.id
                        AND l."startDate" >= ${availableFromDate.toISOString()}
                        LIMIT 1
                    )`
                )
            }
        }
        if(latitude && longitude) {
            const lat = parseFloat(latitude.toString());
            const lon = parseFloat(longitude.toString());
            const radiusInKilometre = 1000;
            const degress = radiusInKilometre / 111.32;
            whereConditions.push(Prisma.sql`ST_DWithin(l.coordinates::geometry,ST_SetSGRID(ST_MakePoint(${lon}, ${lat}), 4326), ${degress})`);
        }
        // to complete //5:26

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "server issue" });
    }
}

export const uploadFiles = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const photoUrls = files.map(async (file) => {
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `properties/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        }
        const uploadResult = await (new Upload({
            client: s3Client,
            params: uploadParams
        }).done());
        return uploadResult.Location;
    });
    res.json({ photoUrls });
}