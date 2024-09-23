import { apiSlice } from './apiSlice';
import { UniversityResponse } from '../../pages/subjects/SubjectAdd';

export type UniversityResponseService = {
  universities: {
    faculties: {
      service: {
        users: {
          userId: number;
          serviceId: number;
          user: {
            name: string;
            username: string;
            email: string;
          };
        }[];
        id: number;
        name: string;
        facultyId: number;
      } | null;
      id: number;
      name: string;
      universityId: number;
    }[];
    id: number;
    name: string;
    location: string;
    ownerId: number;
  }[];
};

export type ServiceResponse = {
  id: number;
  name: string;
  facultyId: number;
  users: {
    userId: number;
    serviceId: number;
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
    };
  }[];
};

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUnisByServiceWhereUserId: builder.query<UniversityResponse, string>({
      query: (id) => ({
        url: `/service/${id}/unis`,
        method: 'GET'
      })
    }),
    addService: builder.mutation<void, { facultyId: number, name: string }>({
      query: (body) => ({
        url: `/service/add`,
        method: 'POST',
        body
      })
    }),
    getAllServicesByUniOwnerId: builder.query<UniversityResponseService, string>({
      query: (id) => ({
        url: `/service/all?ownerId=${id}`,
        method: 'GET',
      })
    }),
    addUserToService: builder.mutation<void, { userId: number, serviceId: number }>({
      query: (body) => ({
        url: `/service/user/add`,
        method: 'POST',
        body
      })
    }),
    getServiceById: builder.query<ServiceResponse, number>({
      query: (id) => ({
        url: `/service/${id}`,
        method: 'GET'
      })
    })
  }),
  overrideExisting: false,
});


export const { useGetUnisByServiceWhereUserIdQuery, useAddServiceMutation, useGetAllServicesByUniOwnerIdQuery, useAddUserToServiceMutation, useGetServiceByIdQuery } = serviceApiSlice;