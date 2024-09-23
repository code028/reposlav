import { prisma } from "../../prisma/client";
import newError from "../utils/newError";


export const addFaculty = async (id: number, name: string) => {

  const newFaculty = await prisma.university.update({
    where: {
      id
    },
    data: {
      faculties: {
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

  return { faculty: newFaculty };
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

  return { id: faculty?.id, name: faculty?.name, university: faculty?.university, departments: faculty?.departments };
}

export const addStudentToFaculty = async (userId: number, facultyId: number) => {

  const studentAlreadyOnFaculty = await prisma.studentsOnFaculties.findFirst({
    where: {
      facultyId: facultyId,
      userId: userId,
    },
  });

  if (studentAlreadyOnFaculty) {
    newError(403, 'Student je već na ovom fakultetu');
  }

  const studentOnFaculty = await prisma.studentsOnFaculties.create({
    data: {
      facultyId: facultyId,
      userId: userId,
    },
  });

  return { studentOnFaculty };
};

export const getFacultyStudent = async (id: number) => {
  const studentsOnFaculties = await prisma.studentsOnFaculties.findMany({
    where: {
      facultyId: id
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

  return { studentsOnFaculties };
};

export const getUnisWithFacsAndStudentsWhereFacsHasServerAndServiceHasUserWithId = async (id: number) => {
  const faculties = await prisma.faculty.findMany({
    where: {
      service: {
        users: {
          some: {
            userId: id
          }
        }
      }
    },
    include: {
      university: true,
      students: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
            }
          }
        }
      }
    }
  });
  
  return { faculties };
};