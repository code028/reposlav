import { apiSlice } from './apiSlice';

export type Professor = {
    id: number;
    name: string;
    username: string;
    email: string;
};

// export type Student = {
//     id: number;
//     name: string;
//     email: string;
// };

// Tip za univerzitet
type University = {
    id: number;
    name: string;
};

// Tip za fakultet
type Faculty = {
    id: number;
    name: string;
    university: University;
};

// Tip za studenta
export type Student = {
    id: number;
    name: string;
    email: string;
    username: string;
};

// Tip za podatke o studentu, fakultetu i univerzitetu
export type StudentData = {
    student: Student;
    faculty: Faculty;
    university: University;
};

export const professorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfessorById: builder.query<Professor[], string>({
            query: (id) => ({
                url: `/professor/${id}`,
                method: 'GET',
            }),
        }),
        getAllStudentsFromFacWhereProfessorWorking: builder.query<StudentData[], string>({
            query: (id) => ({
                url: `/professor/${id}/students`,
                method: 'GET'
            })
        })

    }),
    overrideExisting: false,
});

export const { useGetProfessorByIdQuery, useGetAllStudentsFromFacWhereProfessorWorkingQuery } = professorApiSlice;
