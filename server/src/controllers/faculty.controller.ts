import { Request, Response } from "express";
import { addFaculty, addStudentToFaculty, getFacultyById, getFacultyStudent, getUnisWithFacsAndStudentsWhereFacsHasServerAndServiceHasUserWithId } from "../services/faculty.service";
import newError from "../utils/newError";

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

export const handleAddStudentToFaculty = async (req: Request, res: Response) => {
    try {
        const {userId, facultyId} = req.body;
        const response = await addStudentToFaculty(parseInt(userId), parseInt(facultyId));
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetFacultyStudents = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const parsedId = parseInt(id);
        const response = await getFacultyStudent(parsedId);
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}

export const handleGetUnisWithFacsAndStudentsWhereFacsHasServerAndServiceHasUserWithId = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const parsedId = parseInt(id);
        const response = await getUnisWithFacsAndStudentsWhereFacsHasServerAndServiceHasUserWithId(parsedId);
        return res.send(response);
        
    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}