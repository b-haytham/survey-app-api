import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('hello [users]'));

export default app;
