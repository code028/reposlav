import { apiSlice } from './apiSlice';
import { AddUniReq, GetUniById, GetUnisByOwner } from '../types/university';

export const universityApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUnisByOwner: builder.query<GetUnisByOwner, string>({
            query: (ownerId) => ({
                url: `/university/all?ownerId=${ownerId}`,
                method: 'GET',
            }),
        }),
        addUniversity: builder.mutation<void, AddUniReq>({
            query: (uniData) => ({
                url: `/university/add`,
                method: 'POST',
                body: uniData
              }),
        }),
       getUniById: builder.query<GetUniById, string>({
        query: (id) => ({
            url: `/university/${id}`,
            method: 'GET'
        })
       })
    }),
    overrideExisting: false,
});

export const { useAddUniversityMutation, useGetUnisByOwnerQuery, useGetUniByIdQuery  } = universityApiSlice;
