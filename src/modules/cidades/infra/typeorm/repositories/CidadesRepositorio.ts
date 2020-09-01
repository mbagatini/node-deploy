import { ICidadesRepositorio } from '@modules/cidades/repositories/ICidadesRepositorio';
import { Repository, getRepository } from 'typeorm';
import {
  IRequestBuscaCidadeDTO,
  IResponseBuscaCidadeDTO,
} from '@modules/cidades/dtos/IBuscaCidadeDTO';
import { ICriaCidadeDTO } from '@modules/cidades/dtos/ICriaCidadeDTO';
import Cidade from '../entities/Cidade';

class CidadesRepositorio implements ICidadesRepositorio {
  private ormRepositorio: Repository<Cidade>;

  constructor() {
    this.ormRepositorio = getRepository(Cidade);
  }

  public async cria(dadosCidade: ICriaCidadeDTO): Promise<Cidade> {
    // Cria a cidade no repositório
    const cidade = await this.ormRepositorio.create(dadosCidade);

    // Faz o 'commit' da cidade
    await this.ormRepositorio.save(cidade);

    return cidade;
  }

  public async procuraCidade(dadosCidade: Cidade): Promise<Cidade | undefined> {
    const cidade = await this.ormRepositorio.findOne({
      where: {
        estado_id: dadosCidade.estado.id,
        nome: dadosCidade.nome,
      },
    });

    return cidade;
  }

  public async procuraPeloId(id: number): Promise<Cidade | undefined> {
    const cidade = await this.ormRepositorio.findOne({
      where: {
        id,
      },
    });

    return cidade;
  }

  public async procuraPorParams({
    nome,
    paginaId = 1,
    resultadosPorPagina = 10,
    uf,
  }: IRequestBuscaCidadeDTO): Promise<IResponseBuscaCidadeDTO> {
    // Inicia a query
    let query = await this.ormRepositorio.createQueryBuilder('cidade');
    query = query.innerJoinAndSelect('cidade.estado', 'estado');
    query = query.andWhere('UPPER(estado.uf) = UPPER(:uf)', { uf });

    if (nome)
      query = query.andWhere('cidade.nome like :nome', {
        nome: `%${nome}%`,
      });
    query = query
      .skip((paginaId - 1) * resultadosPorPagina)
      .take(resultadosPorPagina);

    // Recebe Quantidade de páginas e cidades que existem para a busca
    const resultados = await query.getCount();
    const paginas = Math.ceil(resultados / resultadosPorPagina);

    // Recebe o resultado da query
    const cidades = await query.getMany();

    return { cidades, paginas, resultados };
  }

  public async salva(cidade: Cidade): Promise<Cidade> {
    const cidadeSalva = await this.ormRepositorio.save(cidade);

    return cidadeSalva;
  }
}

export default CidadesRepositorio;
