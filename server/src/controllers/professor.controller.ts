import { Request, Response } from "express";

// Services
import { getProfessorById, getProfessorsStudents } from "../services/professor.service";


export const handleGetProfessorById = async (req: Request, res: Response) => {
    try {
        const {id} =  req.params;
        const parsedId = parseInt(id);
        const response = await getProfessorById(parsedId);
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetProfessorsStudents = async (req: Request, res: Response) => {
    try {
        const {id} =  req.params;
        const parsedId = parseInt(id);
        const response = await getProfessorsStudents(parsedId);
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
} 