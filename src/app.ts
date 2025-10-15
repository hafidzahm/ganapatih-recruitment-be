import express from 'express';
import router from './routes/index.ts';
import bodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler.ts';
const app = express();

app.use(bodyParser.json());
// ------------------
app.use(router);
// ------------------
app.use(errorHandler);

export default app;
