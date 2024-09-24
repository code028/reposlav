import { Request, Response } from "express";
import { addFile } from "../services/file.service";

export const handleAddFile = async (req: Request, res: Response) => {
    try {
        const { name, size, type, workId, path } = req.body;

        const fileData = {
            name,
            size,
            type,
            workId,
            path
        }

        const response = await addFile(fileData);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}
