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
