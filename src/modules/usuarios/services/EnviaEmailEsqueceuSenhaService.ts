import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IProvedorEmail from '@shared/providers/ProvedorEmail/models/IProvedorEmail';
import { IUsuariosRepositorio } from '@modules/usuarios/repositories/IUsuariosRepositorio';
import config from '@config/esqueceu_senha';
import { ITokensUsuarioRepositorio } from '../repositories/ITokensUsuarioRepositorio';

@injectable()
export default class EnviaEmailEsqueceuSenhaService {
  constructor(
    @inject('ProvedorEmail')
    private provedorEmail: IProvedorEmail,
    @inject('UsuariosRepositorio')
    private usuariosRepositorio: IUsuariosRepositorio,
    @inject('TokensUsuarioRepositorio')
    private tokensUsuarioRepositorio: ITokensUsuarioRepositorio,
  ) {}

  public async executa(email: string): Promise<void> {
    const usuario = await this.usuariosRepositorio.procuraPeloEmail(email);

    if (!usuario)
      throw new AppError(
        `Não foi encontrado um usuário com o email: ${email}`,
        404,
      );

    // Configura o envio do email de ativação
    const templateFile = config.emailTemplateFile;

    // Gera token no banco de dados
    const token = await this.tokensUsuarioRepositorio.criaToken(usuario);

    await this.provedorEmail.enviaEmail({
      para: {
        email: usuario.email,
        nome: usuario.nome,
      },
      assunto: ' - Recuperação de senha',
      template: {
        file: templateFile,
        variables: {
          nome: usuario.nome,
          link: `${config.rotaParaOLink}?token=${token}`,
        },
      },
    });
  }
}
