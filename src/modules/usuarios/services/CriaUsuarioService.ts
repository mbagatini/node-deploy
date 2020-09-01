import moment from 'moment';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { ICidadesRepositorio } from '@modules/cidades/repositories/ICidadesRepositorio';
import { IEstadosRepositorio } from '@modules/estados/repositories/IEstadosRepositorio';
import Usuario from '../infra/typeorm/entities/Usuario';
import { ICriaUsuarioDTO } from '../dtos/ICriaUsuarioDTO';
import { IUsuariosRepositorio } from '../repositories/IUsuariosRepositorio';
import IProvedorHash from '../providers/ProvedorHash/models/IProvedorHash';

@injectable()
export default class CriaUsuarioService {
  constructor(
    @inject('UsuariosRepositorio')
    private usuariosRepositorio: IUsuariosRepositorio,
    @inject('CidadesRepositorio')
    private cidadesRepositorio: ICidadesRepositorio,
    @inject('EstadosRepositorio')
    private estadosRepositorio: IEstadosRepositorio,
    @inject('ProvedorHash')
    private provedorHash: IProvedorHash,
  ) {}

  public async executa(dadosUsuario: ICriaUsuarioDTO): Promise<Usuario> {
    const emailJaExiste = await this.usuariosRepositorio.procuraPeloEmail(
      dadosUsuario.email,
    );
    const cpfJaExiste = await this.usuariosRepositorio.procuraPeloCpf(
      dadosUsuario.cpf,
    );
    const rgJaExiste = await this.usuariosRepositorio.procuraPeloRg(
      dadosUsuario.rg,
    );

    const estado = await this.estadosRepositorio.procuraPorUf(
      dadosUsuario.cidade.estado.uf,
    );

    Object.assign(dadosUsuario.cidade.estado, estado);

    const cidadeExiste = await this.cidadesRepositorio.procuraCidade(
      dadosUsuario.cidade,
    );

    if (!cidadeExiste)
      throw new AppError(
        `A cidade não foi encontrada: ${dadosUsuario.cidade.nome}`,
      );

    if (emailJaExiste)
      throw new AppError('Esse endereço de e-mail já está sendo utilizado.');
    if (cpfJaExiste) throw new AppError('Esse CPF já está sendo utilizado.');
    if (rgJaExiste) throw new AppError('Esse RG já está sendo utilizado.');

    // Se o email não está em uso, converte a senha para hash
    const hashedSenha = await this.provedorHash.geraHash(dadosUsuario.senha);

    const parsedDate = moment(dadosUsuario.data_nascimento).format(
      'YYYY-MM-DD',
    );

    const usuario = await this.usuariosRepositorio.cria({
      ...dadosUsuario,
      senha: hashedSenha,
      data_nascimento: parsedDate,
      cidade: cidadeExiste,
    });
    const usuarioSalvo = await this.usuariosRepositorio.salva(usuario);

    return usuarioSalvo;
  }
}
