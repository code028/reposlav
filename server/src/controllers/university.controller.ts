import { Request, Response } from "express";
import { getAllUniversitiesByOwner, getAllUniversitiesByOwnerForServices, getServiceFromUniFac, getUniById, registerUniversity } from "../services/university.service";
import { formatValidationErrors } from "../utils/validation";

export const handleUniversityAdd = async (req: Request, res: Response) => {
    try {
        // Validate request fields
        const formattedErrors = formatValidationErrors(req);
        if (formattedErrors.length > 0) return res.status(400).json({ errors: formattedErrors });

        const { userId } = req.body;
        const data = { ...req.body };
        
        const response = await registerUniversity(userId, data);
        return res.send(response);


    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetAllUniversitiesByOwner = async (req: Request, res: Response) => {
    try {
        const { ownerId } = req.query;

        // @ts-ignore
        const userId = parseInt(ownerId)
        const response = await getAllUniversitiesByOwner(userId);
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetAllUniversitiesByOwnerForServices = async (req: Request, res: Response) => {
    try {
        const { ownerId } = req.query;

        // @ts-ignore
        const userId = parseInt(ownerId)
        const response = await getAllUniversitiesByOwnerForServices(userId);
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetUniById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const uniId = parseInt(id); 
        const response = await getUniById(uniId);
        return res.send(response);
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetServiceFromUniFac = async (req: Request, res: Response) => {
    try {
        const {id, id2, id3} = req.params;
        const uniId = parseInt(id); 
        const facultyId = parseInt(id2); 
        const serviceId = parseInt(id3); 
        const response = await getServiceFromUniFac(uniId, facultyId, serviceId);
        return res.send(response);
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}