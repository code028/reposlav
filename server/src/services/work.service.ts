import { prisma } from "../../prisma/client";

type AddWorkTypes = {
    name: string,
    type: string,
    grade: number,
    studentId: number
}

export const addWork = async (WorkData: AddWorkTypes) => {
    const { name, type, grade, studentId } = WorkData;

    const newWork = await prisma.work.create({
        data: {
            studentId,
            name,
            type,
            grade
        }
    })

    return [newWork];
}
