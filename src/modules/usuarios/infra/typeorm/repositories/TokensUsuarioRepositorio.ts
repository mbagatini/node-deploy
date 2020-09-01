import { Repository, getRepository } from 'typeorm';
import { ITokensUsuarioRepositorio } from '@modules/usuarios/repositories/ITokensUsuarioRepositorio';
import { v4 } from 'uuid';
import AppError from '@shared/errors/AppError';
import TokensUsuario from '../entities/TokensUsuario';
import Usuario from '../entities/Usuario';

class TokensUsuarioRepositorio implements ITokensUsuarioRepositorio {
  private ormRepositorio: Repository<TokensUsuario>;

  constructor() {
    this.ormRepositorio = getRepository(TokensUsuario);
  }

  public async procuraPeloToken(
    token: string,
  ): Promise<TokensUsuario | undefined> {
    const tokenUsuario = await this.ormRepositorio.findOne({
      where: { token },
    });

    return tokenUsuario;
  }

  public async criaToken(usuario: Usuario): Promise<string> {
    const token = v4();
    await this.ormRepositorio.save({ token, usuario });

    return token;
  }

  public async removeToken(token: string): Promise<TokensUsuario> {
    const tokenUsuario = await this.ormRepositorio.findOne({
      where: { token },
    });

    if (!tokenUsuario) {
      return {} as TokensUsuario;
    }
    const tokenDeletado = await this.ormRepositorio.remove(tokenUsuario);

    return tokenDeletado;
  }
}

export default TokensUsuarioRepositorio;
