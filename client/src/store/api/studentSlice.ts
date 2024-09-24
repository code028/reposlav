import { apiSlice } from './apiSlice';

type StudentDataRes = {
    id: number
    studentIdFK: number
    studentIndex: string
    name: string
    username: string
    email: string
    universityId: number
    universityName: string
    facultyId: number
    facultyName: string
}

type StudentDataReq = {
    studentIdFK: number
    studentIndex: string
    name: string
    username: string
    email: string
    universityId: number
    universityName: string
    facultyId: number
    facultyName: string
}

export const studentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addStudent: builder.mutation<StudentDataRes[], StudentDataReq>({
            query: (body) => ({
                url: `/student/add`,
                method: 'POST',
                body
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useAddStudentMutation } = studentApiSlice;