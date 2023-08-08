import { NextFunction, Request, Response } from 'express'

export type Collection = 'users' | 'clusters' | 'nodes' | 'connections'

export type Controller = (req: Request, res: Response, next?: NextFunction) => any

export type Error = {
    msg: string
    code: number
}

export type Any = { [key: string]: any }
