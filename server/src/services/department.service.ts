import { prisma } from "../../prisma/client";
import newError from "../utils/newError";

interface DepartmentType {
    type?: 'osnovne' | 'master'
}

export const addDepartment = async (id: number, name: string, type: string) => {

    const department = await prisma.department.create({
        data: {
            name,
            type,
            facultyId: id
        }
    })

    return { department };
}

export const getDepartmentById = async (id: number) => {

    const department = await prisma.department.findUnique({
        where: {
            id
        },
        include: {
            faculty: true,
        }
    });

    const university = await prisma.university.findUnique({
        where: {
            id: department?.faculty.universityId
        }
    })

    if (!department) newError(404, "Department not found!");
    if (!university) newError(404, "University not found!");

    return { department, university };
}

export const getFacsByServiceWhereUserId = async (userId: number) => {

    const user = await prisma.users.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) newError(404, 'User not found!');
    let faculties
    if (user?.role == 'service') {
        faculties = await prisma.faculty.findMany({
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
                departments: {
                    where: {
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
                    },
                },
                university: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    } else if (user?.role == 'admin') {
        faculties = await prisma.faculty.findMany({
            where: {
                university: {
                    ownerId: {
                        equals: user.id
                    }
                }
            },
            include: {
                departments: {
                    where: {
                        faculty: {
                            university: {
                                ownerId: user.id
                            }
                        }
                    }
                },
                university: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }


    if (!faculties || faculties.length === 0) {
        newError(404, "Not found");
    }

    return { faculties };
}

export const getProfessorsOnFacultyByDepId = async (depId: number) => {
    const professorsOnDep = await prisma.professorsOnDepartments.findMany({
        where: {
            departmentId: depId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            }
        }
    });

    return { professorsOnDep };
};

export const getAllProfessorsOnDeps = async () => {
    try {
        const professorsOnDep = await prisma.professorsOnDepartments.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                        facultyId: true,
                    },
                },
            },
        });
        return professorsOnDep;
    } catch (error) {
        console.error("Greška u dohvatanju profesora na odsecima:", error);
        throw new Error("Greška u upitu");
    }
};


export const subjectAddToDepartment = async (subjectId: number, departmentId: number) => {

    const subjectAlreadyOnDep = await prisma.department.findFirst({
        where: {
            subjects: {
                some: {
                    subjectId
                }
            }
        }
    });


    if (subjectAlreadyOnDep) newError(403, `Subject already on ${subjectAlreadyOnDep.name}`);

    const addSubjectToDep = await prisma.subjectsOnDepartments.create({
        data: {
            departmentId,
            subjectId
        }
    });

    return { addSubjectToDep };
}

export const addProfToDep = async (userId: number, depId: number) => {

    const profAlreadyOnDep = await prisma.professorsOnDepartments.findFirst({
        where: {
            departmentId: depId,
            userId
        }
    });

    if (profAlreadyOnDep) newError(403, "Profesor exist on that department")

    const AddProfToDep = await prisma.professorsOnDepartments.create({
        data: {
            departmentId: depId,
            userId
        }
    });

    return { ProfesorOnDep: AddProfToDep };
}
