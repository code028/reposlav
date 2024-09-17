export interface AddUniReq {
    userId: string
    location: string
    name: string
}

export interface AddUniRes {
    location: string
    name: string
}

export interface Department{
    id: string,
    name: string,
    type:string
}

export interface Faculty {
    id: string;
    name: string;
    universityId: string;
    departments: Department[]
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

export interface GetUniById {
    university: University,
    faculties: Faculty[]
}

export interface GetFacById {
    university: University
    departments: Department[],
    id: string,
    name: string
    type: string
}

export interface GetDepById {
    id: string,
    name: string,
    faculty: Faculty,
    university: University
}

export interface GetFacsByServiceWhereUserId{
    faculties: Faculty[]
}
