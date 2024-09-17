import { Request, Response } from "express";
import { addSubject, getSubjectById } from "../services/subject.service";

export const handleSubjectAdd = async (req: Request, res: Response) => {
    try {
        const {name, code, espb, description} = req.body;
        const response = await addSubject(name, code, espb, description);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}
export const handleGetSubjectById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const depId = parseInt(id);
        const response = await getSubjectById(depId);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}
