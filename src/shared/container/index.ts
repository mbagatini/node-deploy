import { container } from 'tsyringe';
import '@modules/usuarios/providers/ProvedorHash';
import '@shared/providers';
import { IUsuariosRepositorio } from '@modules/usuarios/repositories/IUsuariosRepositorio';
import { ICidadesRepositorio } from '@modules/cidades/repositories/ICidadesRepositorio';
import { IEstadosRepositorio } from '@modules/estados/repositories/IEstadosRepositorio';
import { ITokensUsuarioRepositorio } from '@modules/usuarios/repositories/ITokensUsuarioRepositorio';
import UsuariosRepositorio from '@modules/usuarios/infra/typeorm/repositories/UsuariosRepositorio';
import CidadesRepositorio from '@modules/cidades/infra/typeorm/repositories/CidadesRepositorio';
import EstadosRepositorio from '@modules/estados/infra/typeorm/repositories/EstadosRepositorio';
import TokensUsuarioRepositorio from '@modules/usuarios/infra/typeorm/repositories/TokensUsuarioRepositorio';
import { ITransportadorasRepositorio } from '@modules/transportadoras/repositories/ITransportadorasRepositorio';
import TransportadorasRepositorio from '@modules/transportadoras/infra/typeorm/repositories/TransportadoraRepositorio';
import { IViagensRepositorio } from '@modules/viagens/repositories/IViagensRepositorio';
import ViagensRepositorio from '@modules/viagens/infra/typeorm/repositories/ViagensRepositorio';

container.registerSingleton<IUsuariosRepositorio>(
  'UsuariosRepositorio',
  UsuariosRepositorio,
);
container.registerSingleton<IEstadosRepositorio>(
  'EstadosRepositorio',
  EstadosRepositorio,
);
container.registerSingleton<ICidadesRepositorio>(
  'CidadesRepositorio',
  CidadesRepositorio,
);
container.registerSingleton<ITokensUsuarioRepositorio>(
  'TokensUsuarioRepositorio',
  TokensUsuarioRepositorio,
);
container.registerSingleton<ITransportadorasRepositorio>(
  'TransportadorasRepositorio',
  TransportadorasRepositorio,
);
container.registerSingleton<IViagensRepositorio>(
  'ViagensRepositorio',
  ViagensRepositorio,
);
