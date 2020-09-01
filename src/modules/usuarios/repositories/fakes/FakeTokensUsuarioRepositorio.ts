import TokensUsuario from '@modules/usuarios/infra/typeorm/entities/TokensUsuario';
import { v4 } from 'uuid';
import Usuario from '@modules/usuarios/infra/typeorm/entities/Usuario';
import { ITokensUsuarioRepositorio } from '../ITokensUsuarioRepositorio';

class FakeTokensUsuarioRepositorio implements ITokensUsuarioRepositorio {
  private tokensUsuario: TokensUsuario[] = [];

  public async criaToken(usuario: Usuario): Promise<string> {
    const tokenUsuario = new TokensUsuario();

    tokenUsuario.token = v4();
    tokenUsuario.id_usuario = usuario.id;
    tokenUsuario.usuario = usuario;
    tokenUsuario.data_atualizacao = new Date();
    tokenUsuario.data_criacao = new Date();

    this.tokensUsuario.push(tokenUsuario);

    return tokenUsuario.token;
  }

  public async procuraPeloToken(
    token: string,
  ): Promise<TokensUsuario | undefined> {
    const tokenUsuario = this.tokensUsuario.find(t => t.token === token);

    return tokenUsuario;
  }

  public async removeToken(token: string): Promise<TokensUsuario> {
    const tokenUsuario = this.tokensUsuario.find(t => t.token === token);

    const index = this.tokensUsuario.findIndex(t => t === tokenUsuario);

    this.tokensUsuario.splice(index, 1);

    if (!tokenUsuario) {
      return {} as TokensUsuario;
    }

    return tokenUsuario;
  }
}

export default FakeTokensUsuarioRepositorio;
