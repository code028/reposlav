import { prisma } from "../../prisma/client";

type AddFileTypes = {
    name: string,
    size: number,
    type: string,
    workId: number,
    path: string
}

export const addFile = async (FileData: AddFileTypes) => {
    const { name, size, type, workId, path } = FileData;

    const newFile = await prisma.file.create({
        data: {
            name,
            size,
            type,
            workId,
            path
        }
    })

    return [newFile];
}
