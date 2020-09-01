import { IUsuariosRepositorio } from '@modules/usuarios/repositories/IUsuariosRepositorio';
import { Repository, getRepository, QueryBuilder } from 'typeorm';
import { ICriaUsuarioDTO } from '@modules/usuarios/dtos/ICriaUsuarioDTO';
import {
  IRequestBuscaUsuarioDTO,
  IResponseBuscaUsuarioDTO,
} from '@modules/usuarios/dtos/IBuscaUsuarioDTO';
import Usuario from '../entities/Usuario';

/*
  loadEagerRealtions: true => Irá carregar as entidades relacionadas ao usuário (Cidade/Estado)
*/

class UsuariosRepositorio implements IUsuariosRepositorio {
  private ormRepositorio: Repository<Usuario>;

  constructor() {
    this.ormRepositorio = getRepository(Usuario);
  }

  public async procuraPorParams(
    params: IRequestBuscaUsuarioDTO,
  ): Promise<IResponseBuscaUsuarioDTO> {
    // Desestrutura os params
    const { cidadeId, uf, nome, paginaId = 1, cidadeNome } = params;

    // Define limite resultados por página
    const resultadosPorPagina = 10;

    // Inicia a query
    let query = await this.ormRepositorio.createQueryBuilder('usuario');

    // Caso os parâmetros existam, cria as cláusulas
    if (nome)
      query = query.andWhere('usuario.nome like :nome', {
        nome: `%${nome}%`,
      });
    if (cidadeId) {
      query = query.andWhere('cidade.id = :cidadeId', { cidadeId });
    } else if (cidadeNome) {
      query = query.andWhere('cidade.nome like :cidadeNome', {
        cidadeNome: `%${cidadeNome}%`,
      });
    }
    if (uf) query = query.andWhere('UPPER(estado.uf) = UPPER(:uf)', { uf });
    query = query.andWhere('usuario.status = "ativo"');
    query = query.addOrderBy('cidade.nome').addOrderBy('usuario.nome');

    // Realiza o join com as outras tabelas para retornar também a cidade e estado
    query = query
      .innerJoinAndSelect('usuario.cidade', 'cidade')
      .innerJoinAndSelect('cidade.estado', 'estado')

      // faz a paginação dos resultados
      // É necessário fazer isso pois a página inicial é 0
      .skip((paginaId - 1) * resultadosPorPagina)
      .take(resultadosPorPagina);

    // Recebe Quantidade de páginas e usuários que existem para a busca
    const resultados = await query.getCount();
    const paginas = Math.ceil(resultados / resultadosPorPagina);

    // Recebe o resultado da query
    const usuarios = await query.getMany();

    return { usuarios, paginas, resultados };
  }

  public async retornaSenha(id: number): Promise<string | undefined> {
    const usuario = await this.ormRepositorio.findOne({
      where: { id },
      select: ['senha'],
      loadEagerRelations: false,
    });

    return usuario?.senha;
  }

  public async procuraPeloId(
    id: number,
    senha = false,
  ): Promise<Usuario | undefined> {
    const usuario = await this.ormRepositorio.findOne({
      where: { id },
      loadEagerRelations: true,
    });

    if (senha && usuario) {
      const senhaUsuario = await this.retornaSenha(usuario.id);

      Object.assign(usuario, { senha: senhaUsuario });
    }

    return usuario;
  }

  public async procuraPeloEmail(
    email: string,
    senha = false,
  ): Promise<Usuario | undefined> {
    const usuario = await this.ormRepositorio.findOne({
      where: { email },
      loadEagerRelations: true,
    });

    if (senha && usuario) {
      const senhaUsuario = await this.retornaSenha(usuario.id);

      Object.assign(usuario, { senha: senhaUsuario });
    }

    return usuario;
  }

  public async procuraPeloCpf(cpf: string): Promise<Usuario | undefined> {
    const usuario = await this.ormRepositorio.findOne({
      where: { cpf },
      loadEagerRelations: true,
    });

    return usuario;
  }

  public async procuraPeloRg(rg: string): Promise<Usuario | undefined> {
    const usuario = await this.ormRepositorio.findOne({
      where: { rg },
      loadEagerRelations: true,
    });

    return usuario;
  }

  public async cria(dadosUsuario: ICriaUsuarioDTO): Promise<Usuario> {
    // Cria o usuário no repositório
    const usuario = await this.ormRepositorio.create(dadosUsuario);

    // Faz o 'commit' do usuário
    await this.ormRepositorio.save(usuario);

    return usuario;
  }

  public async salva(usuario: Usuario): Promise<Usuario> {
    const usuarioSalvo = await this.ormRepositorio.save(usuario);

    const { id } = usuarioSalvo;

    const usuarioAtualizado = await this.procuraPeloId(id);
    if (!usuarioAtualizado) {
      return usuarioSalvo;
    }

    return usuarioAtualizado;
  }
}

export default UsuariosRepositorio;
