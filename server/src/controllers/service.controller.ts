import { Request, Response } from "express";
import { addUserToService, getServiceById, getServicesByUniversityOwner, getUnisByServiceWhereUserId, serviceAdd } from "../services/service.service";


export const handleGetUnisByServiceWhereUserId = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const userId = parseInt(id);
        const response = await getUnisByServiceWhereUserId(userId);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetServicesByUniversityOwner = async (req: Request, res: Response) => {
    try {
        const {ownerId} = req.query;
        
        // @ts-ignore
        const id = parseInt(ownerId)
        const response = await getServicesByUniversityOwner(id);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleServiceAdd = async (req: Request, res: Response) => {
    try {
        const {name, facultyId} = req.body;
        const facId = parseInt(facultyId);
        const response = await serviceAdd(facId, name);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleAddUserToService = async (req: Request, res: Response) => {
    try {
        const {userId, serviceId} = req.body;

        const userIdParsed = parseInt(userId);
        const serviceIdParsed = parseInt(serviceId);
        const response = await addUserToService(userIdParsed, serviceIdParsed);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetServiceById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const serviceId = parseInt(id);
        const response = await getServiceById(serviceId);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}