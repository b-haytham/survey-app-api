import express from 'express';
import cookieSession from 'cookie-session'
import { expressErrorHandler, NotFoundError } from '@dabra/survey_common';

import getQuestionTypes from './routes/getQuestionTypes'

import surveySchemaCreate from './routes/surveySchemaCreate'
import surveySchemaUpdate from './routes/surveySchemaUpdate'
import getSurveySchemaById from './routes/getSurveySchema'
import getAllSurveySchema from './routes/getSurveySchemaAll'

import surveyDataCreate from './routes/schemaDataCreate'
import getSurveyDataBySchemaId from './routes/getSurveyDataBySchemaId'

const app = express();

app.set('trust proxy', true)

app.use(express.json())

app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== 'test',
	secret: process.env.COOKIE_SECRET,
}))

app.use(getQuestionTypes)

app.use(getSurveySchemaById)
app.use(getAllSurveySchema)
app.use(surveySchemaUpdate)
app.use(surveySchemaCreate)

app.use(surveyDataCreate)
app.use(getSurveyDataBySchemaId)

app.all('*', () => {
	console.log("Not Found");
	throw new NotFoundError();
});

app.use(expressErrorHandler);



export default app;
