import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { corsOptions } from './config/cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFound } from './middlewares/notFound.middleware';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;

