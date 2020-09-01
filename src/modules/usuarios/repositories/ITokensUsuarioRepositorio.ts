import TokensUsuario from '../infra/typeorm/entities/TokensUsuario';
import Usuario from '../infra/typeorm/entities/Usuario';

export interface ITokensUsuarioRepositorio {
  procuraPeloToken(token: string): Promise<TokensUsuario | undefined>;
  criaToken(usuario: Usuario): Promise<string>;
  removeToken(token: string): Promise<TokensUsuario>;
}
