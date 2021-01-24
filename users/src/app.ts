import express from 'express';

const app = express();

app.get('/api/users', (req, res) => res.send('hello [users]'));

export default app;
