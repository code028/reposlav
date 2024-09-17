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
        createUser: builder.mutation<void, UserRegister>({
            query: (userData) => ({
                url: `/register`,
                method: "POST",
                body: userData
            })
        })
    }),
    overrideExisting: false,
});

export const { useGetUserRoleQuery, useCreateUserMutation, useGetUserByIdQuery  } = userApiSlice;
