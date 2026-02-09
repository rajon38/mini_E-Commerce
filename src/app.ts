import express,{ Application, Request, Response } from 'express';

import cookieParser from 'cookie-parser';
import { IndexRoute } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { notFound } from './app/middleware/notFound';
const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Importing routes
app.use("/api/v1", IndexRoute);
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;