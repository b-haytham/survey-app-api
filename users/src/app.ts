import express from 'express';
import cookieSession from 'cookie-session'
import { expressErrorHandler, NotFoundError } from '@dabra/survey_common';


import registerRouter from './routes/register'
import loginRouter from './routes/login'
import logoutRouter from './routes/logout'
import currentUserRouter from './routes/currentUser'
import recoverPassword from './routes/recoverPassword'
import resetPassword from './routes/resetPassword'

const app = express();

app.set('trust proxy', true)

app.use(express.json())

app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== 'test',
	secret: process.env.COOKIE_SECRET,
}))


app.get('/api/users', (req, res) => res.send('hello [users]'));

app.use(recoverPassword)
app.use(resetPassword)
app.use(registerRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(currentUserRouter)

app.all('*', () => {
	console.log("Not Found");
	throw new NotFoundError();
});

app.use(expressErrorHandler);


export default app;
