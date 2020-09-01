import { ICidadesRepositorio } from '@modules/cidades/repositories/ICidadesRepositorio';
import {
  IRequestBuscaCidadeDTO,
  IResponseBuscaCidadeDTO,
} from '@modules/cidades/dtos/IBuscaCidadeDTO';
import { ICriaCidadeDTO } from '@modules/cidades/dtos/ICriaCidadeDTO';
import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';

class FakeCidadesRepositorio implements ICidadesRepositorio {
  private cidades: Cidade[] = [];

  public async cria({ estado, nome }: ICriaCidadeDTO): Promise<Cidade> {
    const cidade = new Cidade();
    const id =
      this.cidades.length === 0
        ? 1
        : Math.max(...this.cidades.map(u => u.id)) + 1;

    Object.assign(cidade, { id, estado, nome });

    this.cidades.push(cidade);

    return cidade;
  }

  public async procuraCidade(cidade: Cidade): Promise<Cidade | undefined> {
    const cidadeExistente = this.cidades.find(
      c => c.nome === cidade.nome && c.estado_id === cidade.estado_id,
    );

    return cidadeExistente;
  }

  public async procuraPeloId(id: number): Promise<Cidade | undefined> {
    const cidade = await this.cidades.find(c => c.id === id);

    return cidade;
  }

  public async procuraPorParams({
    uf,
    nome,
    paginaId = 1,
    resultadosPorPagina = 10,
  }: IRequestBuscaCidadeDTO): Promise<IResponseBuscaCidadeDTO> {
    let cidadesFiltradas = this.cidades;
    cidadesFiltradas = cidadesFiltradas.filter(
      cidade => cidade.estado.uf.toUpperCase() === uf.toUpperCase(),
    );

    if (nome) {
      cidadesFiltradas = cidadesFiltradas.filter(
        cidade => cidade.nome.toUpperCase() === nome.toUpperCase(),
      );
    }
    const quantidadePaginas = Math.ceil(
      cidadesFiltradas.length / resultadosPorPagina,
    );
    const posicaoFinal = resultadosPorPagina * paginaId - 1;
    const posicaoInicial = posicaoFinal - resultadosPorPagina + 1;

    cidadesFiltradas = cidadesFiltradas.filter((cidade, index) => {
      return index >= posicaoInicial && index <= posicaoFinal;
    });
    return {
      cidades: cidadesFiltradas,
      paginas: quantidadePaginas,
      resultados: cidadesFiltradas.length,
    };
  }

  public async salva(cidade: Cidade): Promise<Cidade> {
    const index = this.cidades.findIndex(c => c.id === cidade.id);

    this.cidades[index] = cidade;

    return cidade;
  }
}

export default FakeCidadesRepositorio;
