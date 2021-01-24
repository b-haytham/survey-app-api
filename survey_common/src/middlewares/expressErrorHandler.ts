import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/CustomError';

export const expressErrorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof CustomError) {
		return res
			.status(err.statusCode)
			.send({ errors: err.serializeErrors() });
	}
	console.error(err);

	res.status(400).send({
		errors: [{ message: 'Ooops, Something went Wrong' }],
	});
};
