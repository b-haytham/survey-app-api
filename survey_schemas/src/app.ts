import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('hello [survey_schema]'));

export default app;
