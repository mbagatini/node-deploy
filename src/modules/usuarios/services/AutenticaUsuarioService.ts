import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import IProvedorToken from '@shared/providers/ProvedorToken/models/IProvedorToken';
import { IRequestLoginDTO, IResponseLoginDTO } from '../dtos/ILoginDTO';
import { IUsuariosRepositorio } from '../repositories/IUsuariosRepositorio';
import IProvedorHash from '../providers/ProvedorHash/models/IProvedorHash';
import { StatusUsuario } from '../dtos/EStatusUsuario';

@injectable()
export default class AutenticaUsuarioService {
  constructor(
    @inject('UsuariosRepositorio')
    private usuariosRepositorio: IUsuariosRepositorio,
    @inject('ProvedorHash')
    private provedorHash: IProvedorHash,
    @inject('ProvedorToken')
    private provedorToken: IProvedorToken,
  ) {}

  public async executa({
    email,
    senha,
  }: IRequestLoginDTO): Promise<IResponseLoginDTO> {
    const usuario = await this.usuariosRepositorio.procuraPeloEmail(
      email,
      true,
    );

    if (!usuario) {
      throw new AppError('Email ou senha estão incorretos.', 401);
    }

    if (usuario.status !== StatusUsuario.ATIVO) {
      throw new AppError('Usuário não ativou o cadastro.', 401);
    }

    // Utiliza o método compare do bcrypt para comprara a senha fornecida
    // com a senha armazenada, mesmo estando armazenada em hash
    const comparaSenha = await this.provedorHash.comparaHash(
      senha,
      usuario.senha,
    );
    if (!comparaSenha) {
      throw new AppError('Email ou senha estão incorretos.', 401);
    }
    delete usuario.senha;

    // Busca o segredo e o tempo de expiração do token
    const { segredo, tempoExpiracao } = authConfig.jwt;

    // Cria o token de acesso
    const token = await this.provedorToken.geraToken({
      payload: {},
      secretOrPrivateKey: segredo,
      options: { expiresIn: tempoExpiracao, subject: usuario.id.toString() },
    });

    return { usuario, token };
  }
}
