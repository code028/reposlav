import { apiSlice } from './apiSlice';

export type FileDataReq = {
    name: string,
    size: number,
    type: string,
    workId: number,
    path: string
}
export type FileDataRes = {
    id: number;
    name: string;
    size: number;
    type: string;
    path: string;
    workId: number;
}

export const fileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addFile: builder.mutation<FileDataRes, FileDataReq>({
            query: (body) => ({
                url: `/file/add`,
                method: 'POST',
                body
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useAddFileMutation } = fileApiSlice;