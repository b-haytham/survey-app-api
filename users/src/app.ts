import express from 'express';
import cookieSession from 'cookie-session'
import { expressErrorHandler, NotFoundError } from '@dabra/survey_common';


import registerRouter from './routes/register'

const app = express();

app.set('trust proxy', true)

app.use(express.json())

app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== 'test',
	secret: process.env.COOKIE_SECRET,
}))


app.get('/api/users', (req, res) => res.send('hello [users]'));

app.use(registerRouter)

app.all('*', () => {
	console.log("Not Found");
	throw new NotFoundError();
});

app.use(expressErrorHandler);


export default app;
