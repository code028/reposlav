
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { Mutex } from 'async-mutex';
import { clearTokens, setTokens } from '../slices/sessionSlice';
import { clearUser } from '../slices/userSlice';

const mutex = new Mutex();
export const tags = [];

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:1389/',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).session.accessToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshToken = (api.getState() as RootState).session.refreshToken;
                if (refreshToken) {
                    // Pokušaj da osvežiš access token
                    const refreshResult = await baseQuery(
                        { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
                        api,
                        extraOptions
                    );
                    if (refreshResult.data) {
                        const { accessToken } = refreshResult.data as { accessToken: string };
                        // Postavi novi token
                        api.dispatch(setTokens({ accessToken, refreshToken }));
                        // Ponovi originalni zahtev sa novim access tokenom
                        result = await baseQuery(args, api, extraOptions);
                    } else {
                        // Ako refresh nije uspeo, očisti sesiju
                        api.dispatch(clearTokens());
                        api.dispatch(clearUser());
                    }
                } else {
                    // Ako nema refresh tokena, očisti sesiju
                    api.dispatch(clearTokens());
                    api.dispatch(clearUser());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }    
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: tags,
    endpoints: (builder) => ({}),
    refetchOnMountOrArgChange: 15
});

