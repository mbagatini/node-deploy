import { Router } from 'express';
import EsqueceuSenhaController from '../controllers/EsqueceuSenhaController';
import ResetSenhaController from '../controllers/ResetSenhaController';

const routerSenha = Router();
const esqueceuSenhaController = new EsqueceuSenhaController();
const resetSenhaController = new ResetSenhaController();

routerSenha.post('/esqueceu', esqueceuSenhaController.create);
routerSenha.post('/resetar', resetSenhaController.create);

export default routerSenha;
