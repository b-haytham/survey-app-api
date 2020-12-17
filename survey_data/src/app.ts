import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('hello [surey_data]'));

export default app;
