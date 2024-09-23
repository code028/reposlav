import { apiSlice } from './apiSlice';
import { AddUniReq, GetUniById, GetUnisByOwner } from '../types/university';

type UserType = {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  
  type ServiceUserType = {
    userId: number;
    serviceId: number;
    user: UserType;
  };
  
  type ServiceType = {
    id: number;
    name: string;
    facultyId: number;
    users: ServiceUserType[];
  };
  
  type FacultyType = {
    id: number;
    name: string;
    universityId: number;
    service: ServiceType | null;
  };
  
  type UniversityType = {
    id: number;
    name: string;
    location: string;
    ownerId: number;
    faculties: FacultyType[];
  };
  
type UniversitiesResponseType = UniversityType[];
  
  

export const universityApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUnisByOwner: builder.query<GetUnisByOwner, string>({
            query: (ownerId) => ({
                url: `/university/all?ownerId=${ownerId}`,
                method: 'GET',
            }),
        }),
        getUnisByOwnerForService: builder.query<GetUnisByOwner, string>({
            query: (ownerId) => ({
                url: `/university/all/service?ownerId=${ownerId}`,
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
       }),
       getServiceByUniFac: builder.query<UniversitiesResponseType, {uniId: number, facultyId: number, serviceId: number}>({
        query: ({uniId, facultyId, serviceId}) => ({
            url: `/university/${uniId}/faculty/${facultyId}/service/${serviceId}`,
            method: 'GET'
        })
       })
    }),
    overrideExisting: false,
});

export const { useAddUniversityMutation, useGetUnisByOwnerQuery, useGetUnisByOwnerForServiceQuery, useGetUniByIdQuery, useGetServiceByUniFacQuery  } = universityApiSlice;
