import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoDB: any;

beforeAll(async () => {
	process.env.JWT_KEY = 'longsecret';
	mongoDB = new MongoMemoryServer();
	const mongoUri = await mongoDB.getUri();

	await mongoose.connect(mongoUri, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoDB.stop();
	await mongoose.connection.close();
});
