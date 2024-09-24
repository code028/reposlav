import { prisma } from "../../prisma/client";
import newError from "../utils/newError";

export const getProfessorById = async (id: number) => {
    const professorExist = await prisma.users.findUnique({
        where: {
            id,
            role: 'professor'
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
        }
    });
   
    if (!professorExist) newError(404, "Professor doesn`t exist");

    return [professorExist];
}

export const getProfessorsStudents = async (professorId: number) => {
  const professorWithDepartments = await prisma.professorsOnDepartments.findMany({
    where: {
      userId: professorId,
    },
    include: {
      department: {
        include: {
          faculty: {
            include: {
              university: { // Dodaj podatke o univerzitetu
                select: {
                  id: true,
                  name: true,
                },
              },
              students: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Mapiraj i vrati informacije o studentima, fakultetima i univerzitetima
  const students = professorWithDepartments.flatMap((prof) =>
    prof.department.faculty.students.map((studentOnFaculty) => ({
      student: studentOnFaculty.user, // Podaci o studentu
      faculty: {
        id: prof.department.faculty.id,
        name: prof.department.faculty.name,
      }, // Podaci o fakultetu
      university: {
        id: prof.department.faculty.university.id,
        name: prof.department.faculty.university.name,
      }, // Podaci o univerzitetu
    }))
  );

  // Filtriraj duplikate studenata
  // const students = allStudents.filter(
  //   (studentData, index, self) =>
  //     index === self.findIndex((s) => s.student.id === studentData.student.id)
  // );

  return students;
};
