import { apiSlice } from './apiSlice';
import { GetDepById, GetFacsByServiceWhereUserId } from '../types/university';

export const departmentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addDepartment: builder.mutation<void, { id: number, name: string, type: string }>({
            query: (body) => ({
                url: `/department/add`,
                method: 'POST',
                body
            }),
        }),
        getDepById: builder.query<GetDepById, string>({
            query: (id) => ({
                url: `/department/${id}`,
                method: 'GET'
            })
        }),
        getDepByServiceId: builder.query<void, string>({
            query: (id) => ({
                url: `/service/${id}/deparments`,
                method: 'GET'
            })
        }),
        getFacsByServiceWhereUserId: builder.query<GetFacsByServiceWhereUserId, string>({
            query: (id) => ({
                url: `/department/${id}/unis`,
                method: 'GET'
            })
        }),
        addSubjectToDepartment: builder.mutation<void, { subjectId: string, departmentId: string }>({
            query: (body) => ({
                url: `/department/subjectAdd`,
                method: 'POST',
                body
            }),
        })
    }),
    overrideExisting: false,
});

export const { useAddDepartmentMutation, useGetDepByIdQuery, useGetFacsByServiceWhereUserIdQuery, useAddSubjectToDepartmentMutation } = departmentApiSlice;
