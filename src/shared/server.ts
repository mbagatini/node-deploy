import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import 'reflect-metadata';
import 'dotenv/config';
// import '@shared/infra/typeorm';
import { errors } from 'celebrate';
import routes from './infra/http/routes';
import AppError from './errors/AppError';
import '@shared/container';

const server = express();
server.use(cors());
server.use(express.json());
server.use(routes);

server.use(errors());
server.use(
  (err: Error, request: Request, response: Response, _: NextFunction) => {
    // Caso seja uma instância de AppError, mostra a mensagem e o código.
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: err.message,
    });
  },
);

server.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('✅ - back-end rodando!');
});
