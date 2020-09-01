import { Router } from 'express';
import { celebrate } from 'celebrate';
import verificaAutenticacao from '@shared/infra/http/middlewares/verificaAutenticacao';
import CidadeController from '../controllers/CidadeController';
import { CidadeSchema } from '../validations/CidadeSchema';

const routerCidade = Router();
const cidadeController = new CidadeController();

// POST: Cadastra uma cidade
routerCidade.post(
  '/',

  verificaAutenticacao,
  // Validação do JSON enviado pelo body
  celebrate(
    { body: CidadeSchema.body },
    // Retorna todos os erros e não apenas o primeiro
    { abortEarly: false },
  ),

  cidadeController.store,
);

routerCidade.get(
  '/',
  verificaAutenticacao,
  celebrate({ query: CidadeSchema.query }, { abortEarly: false }),
  cidadeController.index,
);

export default routerCidade;
