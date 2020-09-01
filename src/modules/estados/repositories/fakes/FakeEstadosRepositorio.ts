import {
  IRequestBuscaEstadoDTO,
  IResponseBuscaEstadoDTO,
} from '@modules/estados/dtos/IBuscaEstadoDTO';
import Estado from '@modules/estados/infra/typeorm/entities/Estado';
import { ICriaEstadoDTO } from '@modules/estados/dtos/ICriaEstadoDTO';
import { IEstadosRepositorio } from '../IEstadosRepositorio';

class FakeEstadosRepositorio implements IEstadosRepositorio {
  private estados: Estado[] = [];

  public async cria(dadosEstado: ICriaEstadoDTO): Promise<Estado> {
    const estado = new Estado();
    const id =
      this.estados.length === 0
        ? 1
        : Math.max(...this.estados.map(u => u.id)) + 1;

    Object.assign(estado, { id }, dadosEstado);

    this.estados.push(estado);

    return estado;
  }

  public async procuraPorUf(uf: string): Promise<Estado | undefined> {
    const estado = this.estados.find(
      e => e.uf.toUpperCase() === uf.toUpperCase(),
    );
    return estado;
  }

  public async procuraPorNome(nome: string): Promise<Estado | undefined> {
    const estado = this.estados.find(
      e => e.nome.toUpperCase() === nome.toUpperCase(),
    );
    return estado;
  }

  public async procuraPorParams({
    paginaId = 1,
    resultadosPorPagina = 27,
  }: IRequestBuscaEstadoDTO): Promise<IResponseBuscaEstadoDTO> {
    const quantidadePaginas = Math.ceil(
      this.estados.length / resultadosPorPagina,
    );
    const posicaoFinal = resultadosPorPagina * paginaId - 1;
    const posicaoInicial = posicaoFinal - resultadosPorPagina + 1;

    this.estados = this.estados.filter((estado, index) => {
      return index >= posicaoInicial && index <= posicaoFinal;
    });
    return {
      estados: this.estados,
      paginas: quantidadePaginas,
      resultados: this.estados.length,
    };
  }

  public async salva(estado: Estado): Promise<Estado> {
    const index = this.estados.findIndex(u => u.id === estado.id);

    this.estados[index] = estado;

    return estado;
  }
}

export default FakeEstadosRepositorio;
