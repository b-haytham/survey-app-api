import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UserRoles } from '../UserRoles'

interface UserPayload {
    id: string
    email: string
    role: UserRoles
}


declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}


export const currentUserMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(!req.session?.jwt) {
        return next()
    }

    try {
        const payload = jwt.verify(
            req.session.jwt,
            process.env.JWT_SECRET!
        ) as UserPayload

        req.currentUser = payload
    } catch (error) {
        console.error(error)
    }

    next()
}

