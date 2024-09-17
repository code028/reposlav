import { apiSlice } from './apiSlice';
import { GetDepById } from '../types/university';

export type SubjectAddRes = {
    subject: {
        id: string
        name: string
        code: string
        espb: number
        description: string
    }
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    espb: number;
    description: string;
}

export interface SubjectOnDepartment {
    subjectId: number;
    departmentId: number;
    subject: Subject;
}

export interface Department {
    id: number;
    name: string;
    type: 'osnovne' | 'master';
    facultyId: number;
    subjects: SubjectOnDepartment[];
}

export interface Faculty {
    id: number;
    name: string;
    universityId: number;
    departments: Department[]; 
}

export interface University {
    id: number;
    name: string;
    location: string;
    ownerId: number;
    faculties: Faculty[]; 
}

export interface UniversitiesResponse {
    universities: University[];
}


export const subjectApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addSubject: builder.mutation<SubjectAddRes, { name: string, code: string, espb: number, description: string }>({
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
        }),
        getDepsOnFacsWhereServiceHasUserWithId: builder.query<UniversitiesResponse, string>({
            query: (id) => ({
                url: `/subject/${id}/universities`,
                method: 'GET',
            })
        })
    }),
    overrideExisting: false,
});

export const { useAddSubjectMutation, useGetSubByIdQuery, useGetDepsOnFacsWhereServiceHasUserWithIdQuery } = subjectApiSlice;