import app from './app';

const start = async () => {
	app.listen(3000, () => console.log('>>>> Listening on Post 3000'));
};

start();
