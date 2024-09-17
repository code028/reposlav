import { apiSlice } from './apiSlice';
import { GetDepById, GetFacsByServiceWhereUserId } from '../types/university';

type ProfessorOnDepartment = {
    user: {
      id: number;
      name: string;
      username: string;
    };
    userId: number;
    departmentId: number;
  };
  
  type ProfessorsOnDepartmentsResponse = ProfessorOnDepartment[];

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
            }),
        }),
        addSubjectToDepartment: builder.mutation<void, { subjectId: string, departmentId: string }>({
            query: (body) => ({
                url: `/department/subjectAdd`,
                method: 'POST',
                body
            }),
        }),
        getProfessorsOnDep: builder.query<void, number>({
            query: (id) => ({
                url: `/department/${id}/professors`,
                method: 'GET'
            })
        }),
        getAllProfessorsOnDeps: builder.query<ProfessorsOnDepartmentsResponse, void>({
            query: () => ({
                url: `/department/professors/all`,
                method: 'GET'
            })
        }),
        addProfessorToDepartment: builder.mutation<void, {depId: number, userId: number}>({
            query: (body) => ({
                url: "/department/addProfToDep",
                method: 'POST',
                body
            })
        })
    }),
    overrideExisting: false,
});

export const { useGetAllProfessorsOnDepsQuery, useAddDepartmentMutation, useGetDepByIdQuery, useGetFacsByServiceWhereUserIdQuery, useAddSubjectToDepartmentMutation, useGetProfessorsOnDepQuery, useAddProfessorToDepartmentMutation } = departmentApiSlice;
