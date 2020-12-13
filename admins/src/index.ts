import app from './app';

const start = async () => {
	app.listen(3000, () =>
		console.log('>>>> [admins]:  Listening on Post 3000')
	);
};

start();
