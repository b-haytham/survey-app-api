import { QuestionTypesEnum } from '@dabra/survey_common';
import mongoose from 'mongoose'

import app from './app';
import { AdminCreatedListener } from './events/listeners/AdminCreatedListener';
import { AdminDeletedListener } from './events/listeners/AdminDeletedListener';
import { AdminUpdatedListener } from './events/listeners/AdminUpdatedListener';
import { AdminVerifiedListener } from './events/listeners/AdminVerifiedListener';
import { OrganizationCreatedListener } from './events/listeners/OrganizationCreatedListener';
import { OrganizationDeletedListener } from './events/listeners/OrganizationDeletedListener';
import { OrganizationUpdatedListener } from './events/listeners/OrganizationUpdatedListener';
import { OrganizationVerifiedListener } from './events/listeners/OrganizationVerifiedListener';
import { UserCreatedListener } from './events/listeners/UserCreatedListener';
import { UserDeletedListener } from './events/listeners/UserDeletedListener';
import { UserUpdatedListener } from './events/listeners/UserUpdatedListener';
import { UserVerifiedListener } from './events/listeners/UserVerifiedListener';



import QuestionType from './models/QuestionTypes';
import { natsWrapper } from './NatsWrapper';


const seeder = async () => {
	const data = await QuestionType.find({})
	if(data.length !== 0) {
		return
	}

	const result = await QuestionType.insertMany(
		[
			{ name: QuestionTypesEnum.MULTIPLE_SELECTION },
			{ name: QuestionTypesEnum.NET_PROMOTER_SCORE },
			{ name: QuestionTypesEnum.OPEN_ENDED },
			{ name: QuestionTypesEnum.RATING_STARS },
			{ name: QuestionTypesEnum.SINGLE_SELECTION }
		]
	)
	console.log("SEEDED", "---", result)
}

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

		await natsWrapper.connect('survey', 'survey-srv', 'http://nats-streaming-srv:4222')

		natsWrapper.client.on('close', () => {
			console.log("NATS Connection is Closed")
		})

		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());


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

		await mongoose.connect(`${process.env.MONGO_URI}/survey`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('>>>> Connected to DB');
		seeder()
	} catch (error) {
		console.error(error);
	}

	app.listen(3000, () =>
		console.log('>>>> [survey_schema]:  Listening on Post 3000')
	);
};

start();
