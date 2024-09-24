import { Request, Response } from "express";
import { addStudent } from "../services/student.service";

export const handleAddStudent = async (req: Request, res: Response) => {
    try {
        const { studentIdFK, studentIndex, name, username, email, universityId, universityName, facultyId, facultyName } = req.body;

        const studentData = {
            studentIdFK,
            studentIndex,
            name,
            username,
            email,
            universityId,
            universityName,
            facultyId,
            facultyName
        }

        const response = await addStudent(studentData);
        return res.send(response);

    } catch (error: any) {
        return res.status(error.status || 500).send(error || "Internal server error");
    }
}
