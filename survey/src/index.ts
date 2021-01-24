import { QuestionTypesEnum } from '@dabra/survey_common';
import mongoose from 'mongoose'

import app from './app';

import QuestionType from './models/QuestionTypes';


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
