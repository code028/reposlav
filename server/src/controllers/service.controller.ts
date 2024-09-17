import { Request, Response } from "express";
import { getUnisByServiceWhereUserId } from "../services/service.service";


export const handleGetUnisByServiceWhereUserId = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const serviceId = parseInt(id);
        const response = await getUnisByServiceWhereUserId(serviceId);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}