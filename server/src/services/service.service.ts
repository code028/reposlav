import { prisma } from "../../prisma/client";
import newError from "../utils/newError";


export const getUnisByServiceWhereUserId = async (userId: number) => {

    const universities = await prisma.university.findMany({
        where: {
            faculties: {
                some: {
                    service: {
                        users: {
                            some: {
                                user: {
                                    id: userId
                                }
                            }
                        }
                    }
                }
            }
        },
        include: {
            faculties: {
                where: {
                    service: {
                        users: {
                            some: {
                                user: {
                                    id: userId
                                }
                            }
                        }
                    }
                },
                include: {
                    service: true,
                    departments: true
                }
            }
        }
    });

    if (!universities || universities.length === 0) {
        newError(404, "Not found");
    }

    return { universities };
};