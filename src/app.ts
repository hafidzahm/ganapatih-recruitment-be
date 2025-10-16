import express from 'express';
import router from './routes/index.ts';
import bodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler.ts';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(bodyParser.json());
// ------------------
app.use(router);
// ------------------
app.use(errorHandler);

export default app;
