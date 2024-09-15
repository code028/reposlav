import { prisma } from "../../prisma/client";
import newError from "../utils/newError";

// Types
import { IAddUniversity } from "../types/university";

export const registerUniversity = async (userId: number, data: IAddUniversity) => {
    const {name, location} = data;
    
    const user = await prisma.users.findUnique({
        where:{
            id: userId
        }
    });

    if(!user){
        return newError(400, "Bad Request, User doesnt exist.")
    }    
    const newUniversity = await prisma.university.create({
        data: {
            ownerId: user?.id,
            name,
            location
        }
    });

    return newUniversity;
}

export const getAllUniversitiesByOwner = async( ownerId: number) => {

    const universities = await prisma.university.findMany({
        where: {
            ownerId
        },
        include: {
            faculties: true
        }
    });

    if(!universities){
        return {message: "Not found"}
    }

    return {universities};
}