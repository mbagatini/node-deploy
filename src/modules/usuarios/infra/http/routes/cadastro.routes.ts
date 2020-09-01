import { Router } from 'express';
import { celebrate } from 'celebrate';
import { CadastroSchema } from '../validations/CadastroSchema';
import CadastroController from '../controllers/CadastroController';

const routerCadastro = Router();
const cadastroController = new CadastroController();

// POST: Retorna uma mensagem se o cadastro foi ativado
routerCadastro.post(
  '/usuario/ativar',

  // Validação do JSON enviado pelo body
  celebrate(
    { query: CadastroSchema.ativacaoCadastro },
    // Retorna todos os erros e não apenas o primeiro
    { abortEarly: false },
  ),

  cadastroController.update,
);

export default routerCadastro;
