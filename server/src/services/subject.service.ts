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

export const getDepsOnFacsWhereServiceHasUserWithId = async (userId: number) => {
    const user = await prisma.users.findUnique({
        where: {
            id: userId
        }
    })
    if(!user) newError(404, 'User not found!');

    const universities = await prisma.university.findMany({
        where: {
            faculties: {
                some: {
                    departments: {
                        some: {
                            faculty: {
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
                                userId
                            }
                        }
                    }
                },
                include: {
                    departments: {
                        where: {
                            faculty: {
                                service: {
                                    users: {
                                        some: {
                                            userId
                                        }
                                    }
                                }
                            }
                        },
                        include: {
                            subjects: {
                                include: {
                                    subject: true
                                }
                            }
                        }
                    }
                }
            },
        }
    });
    
    return {universities};  
}