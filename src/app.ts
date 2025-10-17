import express from 'express';
import router from './routes/index.ts';
import bodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler.ts';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());
// ------------------
app.use(router);
// ------------------
app.use(errorHandler);

export default app;
