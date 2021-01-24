import { NextFunction, Request, Response } from 'express';

import { NotAuthorizedError } from '../errors/NotAuthorizedError';
import { UserRoles } from '../UserRoles';

export const requireAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
    console.log(req.currentUser?.role);
	if (req.currentUser?.role !== UserRoles.ADMIN) {
		return next(new NotAuthorizedError());
	}

	next();
};