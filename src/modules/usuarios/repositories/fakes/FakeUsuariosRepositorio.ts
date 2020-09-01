import { IUsuariosRepositorio } from '@modules/usuarios/repositories/IUsuariosRepositorio';
import { ICriaUsuarioDTO } from '@modules/usuarios/dtos/ICriaUsuarioDTO';
import {
  IRequestBuscaUsuarioDTO,
  IResponseBuscaUsuarioDTO,
} from '@modules/usuarios/dtos/IBuscaUsuarioDTO';
import Usuario from '@modules/usuarios/infra/typeorm/entities/Usuario';

class FakeUsuariosRepositorio implements IUsuariosRepositorio {
  private usuarios: Usuario[] = [];

  public async procuraPorParams({
    cidadeId,
    cidadeNome,
    nome,
    paginaId = 1,
    uf,
    resultadosPorPagina = 10,
  }: IRequestBuscaUsuarioDTO): Promise<IResponseBuscaUsuarioDTO> {
    let usuariosFiltrados = this.usuarios;
    if (cidadeId) {
      usuariosFiltrados = usuariosFiltrados.filter(
        usuario => usuario.cidade.id === cidadeId,
      );
    }
    if (cidadeNome) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario =>
        usuario.cidade.nome.toUpperCase().includes(cidadeNome.toUpperCase()),
      );
    }
    if (nome) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario =>
        usuario.nome.toUpperCase().includes(nome.toUpperCase()),
      );
    }
    if (uf) {
      usuariosFiltrados = usuariosFiltrados.filter(
        usuario => usuario.cidade.estado.uf.toUpperCase() === uf.toUpperCase(),
      );
    }

    const quantidadePaginas = Math.ceil(
      usuariosFiltrados.length / resultadosPorPagina,
    );
    const posicaoFinal = resultadosPorPagina * paginaId - 1;
    const posicaoInicial = posicaoFinal - resultadosPorPagina + 1;

    usuariosFiltrados = usuariosFiltrados.filter((usuario, index) => {
      return index >= posicaoInicial && index <= posicaoFinal;
    });

    return {
      usuarios: usuariosFiltrados,
      paginas: quantidadePaginas,
      resultados: usuariosFiltrados.length,
    };
  }

  public async retornaSenha(id: number): Promise<string | undefined> {
    const usuario = this.usuarios.find(u => u.id === id);

    if (!usuario) {
      return undefined;
    }

    const { senha } = usuario;

    return senha;
  }

  public async procuraPeloId(
    id: number,
    senha = false,
  ): Promise<Usuario | undefined> {
    const usuario = this.usuarios.find(u => u.id === id);

    if (!senha) delete usuario?.senha;

    return usuario;
  }

  public async procuraPeloEmail(
    email: string,
    senha = false,
  ): Promise<Usuario | undefined> {
    const usuario = this.usuarios.find(u => u.email === email);

    if (!senha) delete usuario?.senha;

    return usuario;
  }

  public async procuraPeloCpf(cpf: string): Promise<Usuario | undefined> {
    const usuario = this.usuarios.find(u => u.cpf === cpf);
    delete usuario?.senha;

    return usuario;
  }

  public async procuraPeloRg(rg: string): Promise<Usuario | undefined> {
    const usuario = this.usuarios.find(u => u.rg === rg);
    delete usuario?.senha;

    return usuario;
  }

  public async cria(dadosUsuario: ICriaUsuarioDTO): Promise<Usuario> {
    const usuario = new Usuario();
    const id =
      this.usuarios.length === 0
        ? 1
        : Math.max(...this.usuarios.map(u => u.id)) + 1;

    const status = 'inativo';

    Object.assign(usuario, { id, status, ...dadosUsuario });

    this.usuarios.push(usuario);

    return usuario;
  }

  public async salva(usuario: Usuario): Promise<Usuario> {
    const index = this.usuarios.findIndex(u => u.id === usuario.id);

    this.usuarios[index] = usuario;

    return usuario;
  }
}

export default FakeUsuariosRepositorio;
