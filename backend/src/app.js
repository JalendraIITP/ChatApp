import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv'
import bodyParser from 'body-parser';

const app = express();
config({
    path: "../.env"
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json({
    limit: '100kb',
}));

app.use(express.urlencoded({
    extended: true,
    limit: '100kb',
}));

app.use(express.static("public"));

import userRouter from './routes/user.routes.js'

app.use('/', userRouter);

export { app }