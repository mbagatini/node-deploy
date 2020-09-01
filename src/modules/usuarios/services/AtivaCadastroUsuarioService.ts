import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { validate } from 'uuid';
import configCadastro from '@config/ativacao.cadastro';
import { addHours, isAfter } from 'date-fns';
import { IUsuariosRepositorio } from '../repositories/IUsuariosRepositorio';
import { ITokensUsuarioRepositorio } from '../repositories/ITokensUsuarioRepositorio';
import { IRequestAtivacaoCadastroDTO } from '../dtos/ICadastroDTO';
import { StatusUsuario } from '../dtos/EStatusUsuario';

@injectable()
export default class AtivaCadastroUsuarioService {
  constructor(
    @inject('UsuariosRepositorio')
    private usuariosRepositorio: IUsuariosRepositorio,

    @inject('TokensUsuarioRepositorio')
    private tokensUsuarioRepositorio: ITokensUsuarioRepositorio,
  ) {}

  public async executa({ token }: IRequestAtivacaoCadastroDTO): Promise<void> {
    // Verifica se o token existe e se é de um formato válido
    if (!token || !validate(token))
      throw new AppError('O token informado é inválido.', 400);

    // Realiza a busca do token
    const usuario_token = await this.tokensUsuarioRepositorio.procuraPeloToken(
      token,
    );

    if (!usuario_token)
      throw new AppError(`Esse token não foi encontrado: ${token}`, 404);

    // Desestrutura o registro do user_token
    const { id_usuario, data_criacao } = usuario_token;

    // Cria uma data a partir da data de criação do token para verificar se ele
    // já expirou
    const dataParaComparacao = addHours(
      data_criacao,
      configCadastro.tempoExpiracaoTokenAtivacaoEmHoras,
    );

    // Verifica se o token está expirado
    if (isAfter(new Date(Date.now()), dataParaComparacao)) {
      throw new AppError('Token expirado.', 406);
    }

    // Busca o usuário para fazer a ativação
    const usuario = await this.usuariosRepositorio.procuraPeloId(id_usuario);

    if (!usuario)
      throw new AppError(
        `Não foi encontrado um usuário com o id: ${id_usuario}`,
        404,
      );
    // Altera o status para ativo
    usuario.status = StatusUsuario.ATIVO;

    await this.usuariosRepositorio.salva(usuario);

    await this.tokensUsuarioRepositorio.removeToken(token);
  }
}
