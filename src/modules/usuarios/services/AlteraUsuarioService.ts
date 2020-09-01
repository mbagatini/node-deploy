import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { ICidadesRepositorio } from '@modules/cidades/repositories/ICidadesRepositorio';
import moment from 'moment';
import { IEstadosRepositorio } from '@modules/estados/repositories/IEstadosRepositorio';
import Usuario from '../infra/typeorm/entities/Usuario';
import { IUsuariosRepositorio } from '../repositories/IUsuariosRepositorio';
import { IAlteraUsuarioDTO } from '../dtos/IAlteraUsuarioDTO';
import IProvedorHash from '../providers/ProvedorHash/models/IProvedorHash';

@injectable()
export default class AlteraUsuarioService {
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

  public async executa({
    id,
    bairro,
    cep,
    complemento,
    endereco,
    numero,
    cpf,
    data_nascimento,
    nome,
    rg,
    senha,
    senha_antiga,
    cidade,
  }: IAlteraUsuarioDTO): Promise<Usuario> {
    const usuario = await this.usuariosRepositorio.procuraPeloId(id, true);

    if (!usuario)
      throw new AppError(`Não foi encontrado um usuário com o id: ${id}`, 404);

    if (cpf) {
      const usuarioComMesmoCPF = await this.usuariosRepositorio.procuraPeloCpf(
        cpf,
      );
      if (usuarioComMesmoCPF && usuarioComMesmoCPF.id !== id)
        throw new AppError(`O cpf ${cpf} já está sendo utilizado`, 400);

      usuario.cpf = cpf;
    }
    if (rg) {
      const usuarioComMesmoRG = await this.usuariosRepositorio.procuraPeloRg(
        rg,
      );
      if (usuarioComMesmoRG && usuarioComMesmoRG.id !== id)
        throw new AppError(`O rg ${rg} já está sendo utilizado`, 400);

      usuario.rg = rg;
    }

    if (cidade) {
      const { uf } = cidade.estado;

      const estadoExiste = await this.estadosRepositorio.procuraPorUf(uf);
      if (!estadoExiste) {
        throw new AppError(
          `O estado informado não existe, estado: ${cidade.estado.nome}`,
          401,
        );
      }

      Object.assign(cidade, { estado: estadoExiste });

      const cidadeExiste = await this.cidadesRepositorio.procuraCidade(cidade);
      if (!cidadeExiste) {
        throw new AppError(
          `A cidade informada não existe, cidade: ${cidade.nome}, uf: ${uf}`,
          401,
        );
      }

      usuario.cidade = cidadeExiste;
    }

    if (senha && !senha_antiga) {
      throw new AppError(`A senha antiga não foi informada.`, 400);
    }
    if (senha && senha_antiga) {
      const checkSenha = await this.provedorHash.comparaHash(
        senha_antiga,
        usuario.senha,
      );

      if (!checkSenha) {
        throw new AppError(`A senha informada não confere com a atual`, 400);
      }

      // Atualiza a senha do usuário
      usuario.senha = await this.provedorHash.geraHash(senha);
    }

    if (bairro) usuario.bairro = bairro;
    if (cep) usuario.cep = cep;
    if (complemento) usuario.complemento = complemento;
    if (endereco) usuario.endereco = endereco;
    if (numero) usuario.numero = numero;
    if (nome) usuario.nome = nome;
    if (data_nascimento)
      usuario.data_nascimento = moment(data_nascimento).toDate();

    // Salva o usuário na base
    const usuarioNovo = await this.usuariosRepositorio.salva(usuario);

    return usuarioNovo;
  }
}
