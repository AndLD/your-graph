import { Request, Response } from 'express'

async function get(req: Request, res: Response) {
    res.end()
}

async function post(req: Request, res: Response) {
    res.end()
}

async function put(req: Request, res: Response) {
    res.end()
}

async function deleteOne(req: Request, res: Response) {
    res.end()
}

export const edgesController = {
    get,
    post,
    put,
    deleteOne
}
