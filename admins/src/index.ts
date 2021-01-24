import mongoose from 'mongoose'

import app from './app';

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
		await mongoose.connect(`${process.env.MONGO_URI}/admins`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('>>>> Connected to DB');
	} catch (error) {
		console.error(error);
	}


	app.listen(3000, () =>
		console.log('>>>> [admins]:  Listening on Post 3000')
	);
};

start();
