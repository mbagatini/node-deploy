import { IEstadosRepositorio } from '@modules/estados/repositories/IEstadosRepositorio';
import { Repository, getRepository } from 'typeorm';
import { ICriaEstadoDTO } from '@modules/estados/dtos/ICriaEstadoDTO';
import {
  IRequestBuscaEstadoDTO,
  IResponseBuscaEstadoDTO,
} from '@modules/estados/dtos/IBuscaEstadoDTO';
import Estado from '../entities/Estado';

class EstadosRepositorio implements IEstadosRepositorio {
  private ormRepositorio: Repository<Estado>;

  constructor() {
    this.ormRepositorio = getRepository(Estado);
  }

  public async cria(dadosEstado: ICriaEstadoDTO): Promise<Estado> {
    // Cria o Estado no repositório
    const estado = await this.ormRepositorio.create(dadosEstado);

    // Faz o 'commit' da estado
    await this.ormRepositorio.save(estado);

    return estado;
  }

  public async procuraPorParams({
    paginaId = 1,
    resultadosPorPagina = 27,
  }: IRequestBuscaEstadoDTO): Promise<IResponseBuscaEstadoDTO> {
    // Inicia a query
    const query = await this.ormRepositorio
      .createQueryBuilder('estado')
      .skip((paginaId - 1) * resultadosPorPagina)
      .take(resultadosPorPagina);

    // Recebe Quantidade de páginas e cidades que existem para a busca
    const resultados = await query.getCount();
    const paginas = Math.ceil(resultados / resultadosPorPagina);

    // Recebe o resultado da query
    const estados = await query.getMany();

    return { estados, paginas, resultados };
  }

  public async procuraPorUf(uf: string): Promise<Estado | undefined> {
    const estado = await this.ormRepositorio.findOne({ where: { uf } });

    return estado;
  }

  public async procuraPorNome(nome: string): Promise<Estado | undefined> {
    const estado = await this.ormRepositorio.findOne({ where: { nome } });

    return estado;
  }

  public async salva(estado: Estado): Promise<Estado> {
    const estadoSalvo = await this.ormRepositorio.save(estado);

    return estadoSalvo;
  }
}

export default EstadosRepositorio;
