import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import swaggerUI from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Api Clase 52225",
      version: "1.0.23",
      description: "Aqui documentando mi API"
    }
  },
  apis: [`./docs/**/*.yaml`]
}

const spec = swaggerDoc(swaggerOptions);

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(`mongodb+srv://manzano:R91GSBjvF0nTEncU@empowermentlab.gj9tokx.mongodb.net/clase52225?retryWrites=true&w=majority`)
const MESSAGE = process.env.MESSAGE || "HOLA";
app.use(express.json());
app.use(cookieParser());

app.use("/api/doc", swaggerUI.serve, swaggerUI.setup(spec));
app.get('/', (req, res, next)=>{
  res.json({message: `Desde QA: ${MESSAGE}`});
});
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
