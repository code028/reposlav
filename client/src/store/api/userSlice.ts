import { apiSlice } from './apiSlice';
import { UserRegister, UserRoleResponse } from '../types/user';


type User = {
    id: string,
    name: string,
    username: string
    email: string
}

type Session = {
    id: number;
    refreshToken: string;
    userAgent: string;
    active: boolean;
    browser: string | null;
    os: string | null;
    device: string | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
};

interface GetUserById {
    user: User,
    session: Session
}


type Users = {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  
  type UsersResponse = {
    users: Users[];
  };
  
export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserRole: builder.query<UserRoleResponse , number>({
            query: (id) => ({
                url: `/user/${id}/role`,
                method: 'GET',
              }),
        }),
        getUserById: builder.query<GetUserById , {id:number, refreshToken: string}>({
            query: ({id, refreshToken}) => ({
                url: `/user/${id}?refreshToken=${refreshToken}`,
                method: 'GET',
              }),
        }),
        getUsersByRole: builder.query<UsersResponse, string>({
            query: (role) => ({
                url: `/user/${role}/all`,
                method: 'GET'
            })
        }),
        // user register default
        createUser: builder.mutation<void, UserRegister>({
            query: (userData) => ({
                url: `/register`,
                method: 'POST',
                body: userData
            })
        }),
        // create user with role service
        createUserWithServiceRole: builder.mutation<void, any>({
            query: (serviceData) => ({
                url: `/register/user/service`,
                method: 'POST',
                body: serviceData
            })
        }),
        // create user with role professor
        createUserWithProfessorRole: builder.mutation<void, any>({
            query: (professorData) => ({
                url: `/register/user/professor`,
                method: 'POST',
                body: professorData
            })
        })
    }),
    overrideExisting: false,
});

export const { useGetUserRoleQuery,  useGetUserByIdQuery, useCreateUserMutation, useCreateUserWithServiceRoleMutation, useCreateUserWithProfessorRoleMutation, useGetUsersByRoleQuery } = userApiSlice;
