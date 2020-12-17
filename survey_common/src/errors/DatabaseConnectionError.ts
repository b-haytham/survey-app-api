import { CustomError } from './CustomError';

export class DatabaseConnectionError extends CustomError {
	statusCode = 500;
	reason = 'Error Connecting to Database';

	constructor() {
		super('db connection error');
		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	}

	serializeErrors() {
		return [{ message: this.reason }];
	}
}
