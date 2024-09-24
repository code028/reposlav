import { Request, Response } from "express";
import { addWork } from "../services/work.service";

export const handleAddWork = async (req: Request, res: Response) => {
    try {
        const { name, type, grade, studentId } = req.body;

        const workData = {
            name,
            type,
            grade,
            studentId
        }

        const response = await addWork(workData);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}
