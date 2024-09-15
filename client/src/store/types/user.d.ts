export interface LoginResponse {
    userId: string,
    username: string,
    email: string,
    role: string,
    accessToken: string,
    refreshToken: string
}

export interface UserRoleResponse {
    role: string
}

export interface UserRegister {
    name: string,
    username: string,
    email: string,
    password: string,
}


