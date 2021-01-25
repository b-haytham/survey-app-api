import express from 'express';
import cookieSession from 'cookie-session'
import { expressErrorHandler, NotFoundError } from '@dabra/survey_common';

import getQuestionTypes from './routes/getQuestionTypes'

import surveySchemaCreate from './routes/surveySchemaCreate'

const app = express();

app.set('trust proxy', true)

app.use(express.json())

app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== 'test',
	secret: process.env.COOKIE_SECRET,
}))

app.use(getQuestionTypes)
app.use(surveySchemaCreate)

app.all('*', () => {
	console.log("Not Found");
	throw new NotFoundError();
});

app.use(expressErrorHandler);



export default app;
