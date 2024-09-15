export interface AddUniReq {
    userId: string
    location: string
    name: string
}

export interface AddUniRes {
    location: string
    name: string
}

export interface Faculty {
    id: string;
    name: string;
    universityId: string;
}
  
export interface University {
id: number;
name: string;
location: string;
ownerId?: number;
faculties: Faculty[];
}

export interface GetUnisByOwner {
    universities: University[];
}