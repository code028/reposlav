import { Request, Response } from "express";
import { addDepartment, addProfToDep, getAllProfessorsOnDeps, getDepartmentById, getFacsByServiceWhereUserId, getProfessorsOnFacultyByDepId, subjectAddToDepartment } from "../services/department.service";

export const handleDepartmentAdd = async (req: Request, res: Response) => {
    try {
        const {id, name, type} = req.body;
        const depId = parseInt(id); 
        const response = await addDepartment(depId, name, type);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}
export const handleGetDepartmentById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const depId = parseInt(id);
        const response = await getDepartmentById(depId);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetFacsByServiceWhereUserId = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const depId = parseInt(id);
        const response = await getFacsByServiceWhereUserId(depId);
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetProfessorsOnFacultyByDepId = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const depId = parseInt(id);
        const response = await getProfessorsOnFacultyByDepId(depId);
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetAllProfessorsOnDeps = async (req: Request, res: Response) => {
    try {
        const response = await getAllProfessorsOnDeps();
        return res.send(response);
    } catch (error: any) {
        console.error("Greška u hvatanju profesora:", error); // Dodaj ovo da vidiš više detalja
        return res.status(error.status || 500).send(error.message || "Internal server error");
    }
};

export const handleSubjectAddToDepartment = async (req: Request, res: Response) => {
    try {
        const {subjectId, departmentId} = req.body;
        console.log({subjectId, departmentId});
        const response = await subjectAddToDepartment(parseInt(subjectId), parseInt(departmentId));
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleAddProfToDep = async (req: Request, res: Response) => {
    try {
        const {userId, depId} = req.body;
        console.log({userId, depId});
        const response = await addProfToDep(parseInt(userId), parseInt(depId));
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}