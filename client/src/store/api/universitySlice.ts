import { apiSlice } from './apiSlice';
import { AddUniReq, GetUnisByOwner } from '../types/university';

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
       
    }),
    overrideExisting: false,
});

export const { useAddUniversityMutation, useGetUnisByOwnerQuery  } = universityApiSlice;
