import mongoose from 'mongoose'

import app from './app';
import { natsWrapper } from './NatsWrapper';


const start = async () => {

	
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}

	try {

		await natsWrapper.connect('survey', 'mailer-srv', 'http://nats-streaming-srv:4222')

		natsWrapper.client.on('close', () => {
			console.log("NATS Connection is Closed")
		})

		if(process.env.NODE_ENV === 'production') {
			process.on("SIGINT", () => natsWrapper.client.close());
			process.on("SIGTERM", () => natsWrapper.client.close());
		}


		await mongoose.connect(`${process.env.MONGO_URI}/mailer`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('>>>> Connected to DB');
	} catch (error) {
		console.error(error);
	}


	app.listen(3000, () =>
		console.log('>>>> [mailer]:  Listening on Post 3000')
	);
};

start();
