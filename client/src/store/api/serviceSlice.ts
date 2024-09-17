import { apiSlice } from './apiSlice';
import { UniversityResponse } from '../../pages/subjects/SubjectAdd';

export const serviceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUnisByServiceWhereUserId: builder.query<UniversityResponse, string>({
        query: (id) => ({
            url: `/service/${id}/unis`,
            method: 'GET'
        })
       })
    }),
    overrideExisting: false,
});

export const { useGetUnisByServiceWhereUserIdQuery } = serviceApiSlice;
