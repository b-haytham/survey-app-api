import express from 'express';
import cookieSession from 'cookie-session';
import { expressErrorHandler, NotFoundError } from '@dabra/survey_common';

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
		secret: process.env.COOKIE_SECRET,
	})
);

app.get('/', (req, res) => res.send('hello'));

app.all('*', () => {
	throw new NotFoundError();
});

app.use(expressErrorHandler);

export default app;
