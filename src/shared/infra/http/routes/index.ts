import { Router } from 'express';
import routerUsuario from '@modules/usuarios/infra/http/routes/usuario.routes';
import routerLogin from '@modules/usuarios/infra/http/routes/login.routes';
import routerCidade from '@modules/cidades/infra/http/routes/cidade.routes';
import routerEstado from '@modules/estados/infra/http/routes/estado.routes';
import routerCadastro from '@modules/usuarios/infra/http/routes/cadastro.routes';
import routerSenha from '@modules/usuarios/infra/http/routes/senha.routes';
import routerTransportadora from '@modules/transportadoras/infra/http/routes/transportadora.routes';
import routerViagem from '@modules/viagens/infra/http/routes/viagem.routes';
import pingRouter from './ping.routes';

const routes = Router();

routes.use('/ping', pingRouter);
routes.use('/usuarios', routerUsuario);
routes.use('/login', routerLogin);
routes.use('/cidades', routerCidade);
routes.use('/estados', routerEstado);
routes.use('/cadastro', routerCadastro);
routes.use('/senha', routerSenha);
routes.use('/transportadoras', routerTransportadora);
routes.use('/viagens', routerViagem);
export default routes;
