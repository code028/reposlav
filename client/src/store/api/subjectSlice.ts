import { apiSlice } from './apiSlice';
import { GetDepById } from '../types/university';

export type Subject = {
    subject: {
        id: string
    name: string
    code: string
    espb: number
    description: string
    }
}

export const subjectApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addSubject: builder.mutation<Subject, {name: string, code: string, espb: number, description: string}>({
            query: (body) => ({
                url: `/subject/add`,
                method: 'POST',
                body
              }),
        }),
        getSubById: builder.query<GetDepById, string>({
            query: (id) => ({
                url: `/subject/${id}`,
                method: 'GET'
            })
        })
    }),
    overrideExisting: false,
});

export const { useAddSubjectMutation, useGetSubByIdQuery } = subjectApiSlice;
