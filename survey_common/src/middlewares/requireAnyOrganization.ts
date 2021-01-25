import { NextFunction, Request, Response } from 'express';

import { NotAuthorizedError } from '../errors/NotAuthorizedError';
import { UserRoles } from '../UserRoles';

export const requireOrganizationAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
    console.log(req.currentUser?.role);
	if (req.currentUser?.role === UserRoles.ORGANIZATION_ADMIN || req.currentUser?.role === UserRoles.ORGANIZATION_USER ) {
        next();
    }
    
    return next(new NotAuthorizedError());
};