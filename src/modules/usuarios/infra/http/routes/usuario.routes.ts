import { Router } from 'express';
import { celebrate } from 'celebrate';
import verificaAutenticacao from '@shared/infra/http/middlewares/verificaAutenticacao';
import UsuarioController from '../controllers/UsuarioController';
import { UsuarioSchema } from '../validations/UsuarioSchema';

const routerUsuario = Router();
const usuarioController = new UsuarioController();

// GET: Busca de usuários
routerUsuario.get(
  '/',
  // Validação do JSON enviado pelo body
  verificaAutenticacao,
  celebrate(
    { query: UsuarioSchema.buscaUsuario.Query },

    // Retorna todos os erros e não apenas o primeiro
    { abortEarly: false },
  ),
  usuarioController.index,
);

// GET: Busca um usuário pelo ID
routerUsuario.get(
  '/:id',
  verificaAutenticacao,
  celebrate(
    { params: UsuarioSchema.buscaUsuario.Params },

    // Retorna todos os erros e não apenas o primeiro
    { abortEarly: false },
  ),
  usuarioController.show,
);

// POST: Criação de usuários
routerUsuario.post(
  '/',

  // Validação do JSON enviado pelo body
  celebrate(
    { body: UsuarioSchema.criaUsuario },
    // Retorna todos os erros e não apenas o primeiro
    { abortEarly: false },
  ),

  usuarioController.store,
);

// PUT: Alteração de cadastro do usuário logado
routerUsuario.put(
  '/eu',

  verificaAutenticacao,
  // Validação do JSON enviado pelo body e do id presente na Query
  celebrate(
    {
      body: UsuarioSchema.alteraUsuario.Body,
    },
    // Retorna todos os erros e não apenas o primeiro
    {
      abortEarly: false,
    },
  ),

  usuarioController.update,
);

export default routerUsuario;
