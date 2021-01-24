import express from 'express';
import cookieSession from 'cookie-session'
import { expressErrorHandler, NotFoundError } from '@dabra/survey_common';

import createAdminRouter from './routes/createAdmin'
import loginRouter from './routes/login'

const app = express();

app.set('trust proxy', true)

app.use(express.json())

app.use(cookieSession({
    signed: false,
	secure: process.env.NODE_ENV !== 'test',
	secret: process.env.COOKIE_SECRET,
}))

app.get('/api/admins', (req, res) => res.send('hello [admins]'));

app.use(createAdminRouter)
app.use(loginRouter)


app.all('*', () => {
	console.log("Not Found");
	throw new NotFoundError();
});

app.use(expressErrorHandler);



export default app;
