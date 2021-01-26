

import app from './app';


const start =  () => {

	app.listen(3000, () =>
		console.log('>>>> [mailer]:  Listening on Post 3000')
	);
};

start();
