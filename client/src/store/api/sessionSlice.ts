import { apiSlice } from './apiSlice';
import {LoginResponse} from '../types/user';

export const sessionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse , { login: string; password: string }>({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation<void, {refreshToken: string}>({
            query: (body) => ({
                url: '/auth/logout',
                method: 'POST',
                body
            })
        })
    }),
    overrideExisting: false,
});

// Eksporutj automatski generisane hook-ove za pozivanje API-ja
export const { useLoginMutation, useLogoutMutation  } = sessionApiSlice;
