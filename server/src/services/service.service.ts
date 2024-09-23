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

export const getServicesByUniversityOwner = async (userId: number) => {

    const universities = await prisma.university.findMany({
        where: {
            ownerId: userId
        },
        include: {
            faculties: {
                include: {
                  service: {
                    include: {
                      users: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    username: true,
                                    email: true
                                }
                            }
                        }
                      }
                    },
                  },
                },
                where: {
                  service: {
                    isNot: null,
                  },
                },
              },
        }
    });

    if (!universities || universities.length === 0) {
        newError(404, "Not found");
    }

    return { universities };
};

export const serviceAdd = async (facultyId: number, name: string) => {

    const serviceExist = await prisma.service.findFirst({
        where: {
            facultyId
        }
    })

    if (serviceExist) {
        newError(403, "Service already exist on that faculty");
    }

    const newService = await prisma.service.create({
        data: {
            facultyId,
            name
        }
    })

    return { newService };
};

export const addUserToService = async (userId: number, serviceId: number) => {

    const userAlreadyOnService = await prisma.usersOnService.findFirst({
        where: {
            serviceId,
            userId
        }
    });

    if(userAlreadyOnService) newError(403, "User already on service");

    const ServiceNewUser = await prisma.usersOnService.create({
        data: {
            userId,
            serviceId
        }
    });

    return [ServiceNewUser];
};

export const getServiceById = async (serviceId: number) => {

    const service = await prisma.service.findUnique({
        where: {
            id: serviceId
        },
        include: {
            users: {
                where: {
                    serviceId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name:true,
                            username: true,
                            email: true,
                        }
                    }
                }
            }
        }
    });

    if(!service) newError(404, "Service doesnt exist");

    return [service] ;
};