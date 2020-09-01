import { Router } from 'express';
import { celebrate } from 'celebrate';
import LoginController from '../controllers/LoginController';
import { LoginSchema } from '../validations/LoginSchema';

const routerLogin = Router();
const loginController = new LoginController();

// POST: Retorna um token de acesso à aplicação
routerLogin.post(
  '/',
  // Validação do JSON enviado pelo body
  celebrate(
    { body: LoginSchema.realizaLogin },
    // Retorna todos os erros e não apenas o primeiro
    { abortEarly: false },
  ),

  loginController.create,
);

export default routerLogin;
