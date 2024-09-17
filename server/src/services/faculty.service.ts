import { prisma } from "../../prisma/client";
import newError from "../utils/newError";


export const addFaculty = async (id: number, name: string) => {

    const newFaculty = await prisma.university.update({
        where: {
            id
        },
        data:{
            faculties:{
                create: {
                    name
                }
            }
        }
    })

    // const newFaculty = await prisma.faculty.create({
    //     data: {
    //         name: name,
    //         universityId: id
    //     }
    // });

    return {faculty: newFaculty};
}
export const getFacultyById = async (id: number) => {

    const faculty = await prisma.faculty.findUnique({
        where: {
            id
        },
        include: {
            departments: true,
            university: true
        }
    });

    if (!faculty) newError(404, "Not found!");

    return {id: faculty?.id, name: faculty?.name, university: faculty?.university, departments: faculty?.departments};
}
