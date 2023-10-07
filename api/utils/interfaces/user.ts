export interface IUser {
    _id: string
    name: string
    email: string
    password: string
    status: UserStatus
    active: boolean
    timestamp: number
    lastUpdateTimestamp?: number
    keywords: string[]
    user: string
}

export interface IUserState {
    _id: string
    name: string
    email: string
    status: UserStatus
    active: boolean
    timestamp: number
    lastUpdateTimestamp?: number
}

export interface IUserInfo {
    _id: string
    name: string
    email: string
    status: UserStatus
    active: boolean
    timestamp: number
    lastUpdateTimestamp?: number
    keywords?: string[]
    user?: string
}

export interface IUserPost {
    name: string
    email: string
    password: string
    status: UserStatus
    active: boolean
    keywords: string[]
}

export interface IUserPostBody {
    name: string
    email: string
    password: string
}

export type UserStatus = 'admin' | 'owner' | 'user' | 'unlimited' | 'banned'

export interface IFetchAuthorizedUserResponse {
    result: IUserInfo | null
}

export interface IFetchUsersResponse {
    result: IUserInfo[]
}

export interface IUserPostResponse {
    result: string
}

export interface IUserPutBody {
    status: UserStatus
}

export interface IUserPutResponse {
    result: IUserInfo
}
