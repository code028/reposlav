import { Request, Response } from "express";
import { addFaculty, getFacultyById } from "../services/faculty.service";

export const handleFacultyAdd = async (req: Request, res: Response) => {
    try {
        const {id, name} = req.body;
        const uniId = parseInt(id); 
        const response = await addFaculty(uniId, name);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}
export const handleGetFacultyById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const facId = parseInt(id);
        const response = await getFacultyById(facId);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}
