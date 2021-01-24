import express from 'express';

const app = express();

app.get('/api/admins', (req, res) => res.send('hello [admins]'));

export default app;
