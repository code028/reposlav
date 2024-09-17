import { prisma } from "../../prisma/client";
import newError from "../utils/newError";


export const addSubject = async (name: string, code: string, espb: number, description: string) => {

    const subject = await prisma.subject.create({
        data: {
            name,
            code,
            espb,
            description
        }
    })

    return {subject};
}

export const getSubjectById = async (id: number) => {

    const subject = await prisma.subject.findUnique({ 
        where: {
            id
        },
        include: {
            departments: {
                where: {
                    subjectId: id
                }
            }
        }
    });

    if(!subject) newError(404, 'Not found');
    
    return subject;
}
