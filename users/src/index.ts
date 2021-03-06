import mongoose from 'mongoose'

import app from './app';
import { natsWrapper } from './NatsWrapper';

const start = async () => {

	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET must be defined');
	}

	if (!process.env.COOKIE_SECRET) {
		throw new Error('COOKIE_SECRET must be defined');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}

	try {

		await natsWrapper.connect('survey', 'users-srv', 'http://nats-streaming-srv:4222')

		natsWrapper.client.on('close', () => {
			console.log("NATS Connection is Closed")
		})


		if(process.env.NODE_ENV === 'production') {
			process.on("SIGINT", () => natsWrapper.client.close());
			process.on("SIGTERM", () => natsWrapper.client.close());
		}




		await mongoose.connect(`${process.env.MONGO_URI}/users`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('>>>> Connected to DB');
	} catch (error) {
		console.error(error);
	}

	app.listen(3000, () =>
		console.log('>>>> [users]:  Listening on Post 3000')
	);
};

start();
