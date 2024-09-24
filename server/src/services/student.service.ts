import { prisma } from "../../prisma/client";
import newError from "../utils/newError";


type AddStudentTypes = {
    studentIdFK: number
    studentIndex: string
    name: string
    username: string
    email: string
    universityId: number
    universityName: string
    facultyId: number
    facultyName: string
}

export const addStudent = async (StudentData: AddStudentTypes) => {
    const {
        studentIdFK, studentIndex,
        name, username,
        email,
        universityId, universityName,
        facultyId, facultyName
    } = StudentData;

    const newStudent = await prisma.student.create({
        data: {
            studentIdFK, studentIndex,
            name, username,
            email,
            universityId, universityName,
            facultyId, facultyName,
        }
    });

    return [newStudent];
}
