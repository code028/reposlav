import { apiSlice } from './apiSlice';
import { GetFacById } from '../types/university';

type AddStudentToFacultyBody = {
  userId: number;
  facultyId: number;
};

type Student = {
  userId: number;
  facultyId: number;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
};

type GetStudentsOnFacultiesResponse = {
  studentsOnFaculty: Student[];
};

type FacultiesResponse = {
  faculties: {
    id: number;
    name: string;
    universityId: number;
    university: {
      id: number;
      name: string;
      location: string;
      ownerId: number;
    };
    students: {
      userId: number;
      facultyId: number;
      user: {
        id: number;
        name: string;
        username: string;
        email: string;
      };
    }[];
  }[];
};



export const facultyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addFaculty: builder.mutation<void, { id: number, name: string }>({
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
    }),
    addStudentToFaculty: builder.mutation<void, AddStudentToFacultyBody>({
      query: (body) => ({
        url: '/faculty/addStudentToFac',
        method: 'POST',
        body
      }),
    }),
    getStudentsOnFaculties: builder.query<GetStudentsOnFacultiesResponse, string>({
      query: (id) => ({
        url: `/faculty/${id}/students`,
        method: 'GET',
      }),
    }),
    getStudentsOnFacsWhereServiceHasUserWithId: builder.query<FacultiesResponse ,string>({
      query: (id) => ({
        url: `/faculty/${id}/service`,
        method: 'GET'
      })
    })
  }),
  overrideExisting: false,
});

export const { useAddFacultyMutation, useGetFacByIdQuery, useAddStudentToFacultyMutation, useGetStudentsOnFacultiesQuery, useGetStudentsOnFacsWhereServiceHasUserWithIdQuery } = facultyApiSlice;
