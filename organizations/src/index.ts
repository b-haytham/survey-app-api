//this is a comment to test github action
import app from './app';
import mongoose from 'mongoose';
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

		await natsWrapper.connect('survey', 'organization-srv', 'http://nats-streaming-srv:4222')

		natsWrapper.client.on('close', () => {
			console.log("NATS Connection is Closed")
		})

		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());


		await mongoose.connect(`${process.env.MONGO_URI}/organizations`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('>>>> Connected to DB');
	} catch (error) {
		console.error(error);
	}

	app.listen(3000, () => console.log('>>>> Listening on Post 3000'));
};

start();
