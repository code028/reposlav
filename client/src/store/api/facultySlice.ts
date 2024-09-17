import { apiSlice } from './apiSlice';
import { GetFacById } from '../types/university';

export const facultyApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addFaculty: builder.mutation<void, {id: number, name: string}>({
            query: (body) => ({
                url: `/faculty/add`,
                method: 'POST',
                body
              }),
        }),
       getFacById: builder.query<GetFacById, string>({
        query: (id) => ({
            url: `/faculty/${id}`,
            method: 'GET'
        })
       })
    }),
    overrideExisting: false,
});

export const { useAddFacultyMutation, useGetFacByIdQuery } = facultyApiSlice;
