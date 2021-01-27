import express from 'express';
import { expressErrorHandler, NotFoundError } from '@dabra/survey_common';

const app = express();

app.set('trust proxy', true)


app.all('*', () => {
	console.log("Not Found");
	throw new NotFoundError();
});

app.use(expressErrorHandler);


export default app;
