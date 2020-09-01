import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import config from '@config/ativacao.cadastro';
import { IUsuariosRepositorio } from '@modules/usuarios/repositories/IUsuariosRepositorio';
import { addHours, isAfter } from 'date-fns';
import { ITokensUsuarioRepositorio } from '../repositories/ITokensUsuarioRepositorio';
import IProvedorHash from '../providers/ProvedorHash/models/IProvedorHash';
import { StatusUsuario } from '../dtos/EStatusUsuario';

interface IRequest {
  senha: string;
  token: string;
}

@injectable()
export default class ResetaSenhaService {
  constructor(
    @inject('ProvedorHash')
    private provedorHash: IProvedorHash,
    @inject('UsuariosRepositorio')
    private usuariosRepositorio: IUsuariosRepositorio,
    @inject('TokensUsuarioRepositorio')
    private tokensUsuarioRepositorio: ITokensUsuarioRepositorio,
  ) {}

  public async executa({ senha, token }: IRequest): Promise<void> {
    const usuarioToken = await this.tokensUsuarioRepositorio.procuraPeloToken(
      token,
    );

    if (!usuarioToken)
      throw new AppError(`Não foi encontrado o token: ${token}`, 404);

    // Se o momento atual for 2h depois da criação, o token expirou
    const tokenDataCriacao = usuarioToken.data_criacao;
    const dataParaComparacao = addHours(tokenDataCriacao, 2);

    if (isAfter(new Date(Date.now()), dataParaComparacao)) {
      throw new AppError('Token expirado');
    }

    const usuario = await this.usuariosRepositorio.procuraPeloId(
      usuarioToken.id_usuario,
    );

    if (!usuario) {
      throw new AppError(`Usuário não existe id: ${usuarioToken.id_usuario}`);
    }

    if (usuario.status !== StatusUsuario.ATIVO) {
      throw new AppError(
        `Usuário não está ativo id: ${usuarioToken.id_usuario}`,
      );
    }

    // Se o token for válido e o usuário existir e estiver ativo, reseta a senha
    usuario.senha = await this.provedorHash.geraHash(senha);

    // Remove o token do banco
    await this.tokensUsuarioRepositorio.removeToken(token);

    // Salva o usuário com a nova senha
    await this.usuariosRepositorio.salva(usuario);
  }
}
