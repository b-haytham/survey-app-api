import mongoose from 'mongoose'

import app from './app';
import { natsWrapper } from './NatsWrapper';

import { AdminCreatedListener } from './events/AdminCreatedListener';
import { AdminUpdatedListener } from './events/AdminUpdatedListener';
import { AdminDeletedListener } from './events/AdminDeletedListener';
import { AdminVerifiedListener } from './events/AdminVerifiedListener';
import { OrganizationCreatedListener } from './events/OrganizationCreatedListener';
import { OrganizationUpdatedListener } from './events/OrganizationUpdatedListener';
import { OrganizationDeletedListener } from './events/OrganizationDeletedListener';
import { OrganizationVerifiedListener } from './events/OrganizationVerifiedListener';
import { UserCreatedListener } from './events/UserCreatedListener';
import { UserUpdatedListener } from './events/UserUpdatedListener';
import { UserDeletedListener } from './events/UserDeletedListener';
import { UserVerifiedListener } from './events/UserVerifiedListener';

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

		new AdminCreatedListener(natsWrapper.client).listen()
		new AdminUpdatedListener(natsWrapper.client).listen()
		new AdminDeletedListener(natsWrapper.client).listen()
		new AdminVerifiedListener(natsWrapper.client).listen()

		new OrganizationCreatedListener(natsWrapper.client).listen()
		new OrganizationUpdatedListener(natsWrapper.client).listen()
		new OrganizationDeletedListener(natsWrapper.client).listen()
		new OrganizationVerifiedListener(natsWrapper.client).listen()

		new UserCreatedListener(natsWrapper.client).listen()
		new UserUpdatedListener(natsWrapper.client).listen()
		new UserDeletedListener(natsWrapper.client).listen()
		new UserVerifiedListener(natsWrapper.client).listen()

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
