import express from 'express';
import router from './routes/index.ts';
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser);
// ------------------
app.use(router);

export default app;
