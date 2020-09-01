import { Router } from 'express';
import { celebrate } from 'celebrate';
import verificaAutenticacao from '@shared/infra/http/middlewares/verificaAutenticacao';
import EstadoController from '../controllers/EstadoController';
import { EstadoSchema } from '../validations/EstadoSchema';

const routerEstado = Router();
const estadoController = new EstadoController();

// POST: Cadastra um estado
routerEstado.post(
  '/',

  verificaAutenticacao,
  // Validação do JSON enviado pelo body
  celebrate(
    { body: EstadoSchema.body },
    // Retorna todos os erros e não apenas o primeiro
    { abortEarly: false },
  ),

  estadoController.store,
);

// GET: Busca todos estados
routerEstado.get(
  '/',

  // Validação do JSON enviado pelo body
  celebrate(
    { query: EstadoSchema.query },
    // Retorna todos os erros e não apenas o primeiro
    { abortEarly: false },
  ),

  estadoController.index,
);
export default routerEstado;
