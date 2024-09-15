import { apiSlice } from './apiSlice';
import { UserRegister, UserRoleResponse } from '../types/user';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserRole: builder.query<UserRoleResponse , number>({
            query: (id) => ({
                url: `/user/${id}/role`,
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

export const { useGetUserRoleQuery, useCreateUserMutation  } = userApiSlice;
