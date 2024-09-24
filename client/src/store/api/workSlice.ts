import { apiSlice } from './apiSlice';

type WorkDataRes = {
    id: number;
    name: string;
    type: string;
    grade: number;
    studentId: number;
}

type WorkDataReq = {
    name: string,
    type: string,
    grade: number,
    studentId: number
}

export type FileWithWorkAndStudent = {
    id: number;
    name: string;
    size: number;
    type: string;
    path: string;
    work: {
      id: number;
      name: string;
      type: string;
      grade: number;
      student: {
        id: number;
        studentIdFK: number;
        studentIndex: string;
        name: string;
        username: string;
        email: string;
        universityId: number;
        universityName: string;
        facultyId: number;
        facultyName: string;
      };
    };
  };
  


export const workApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addWork: builder.mutation<WorkDataRes[], WorkDataReq>({
            query: (body) => ({
                url: `/work/add`,
                method: 'POST',
                body
            }),
        }),
        getAllWorks: builder.query<FileWithWorkAndStudent[], void>({
            query: () => ({
                url: `/files`,
                method: 'GET'
            })
        })
    }),
    overrideExisting: false,
});

export const { useAddWorkMutation, useGetAllWorksQuery } = workApiSlice;