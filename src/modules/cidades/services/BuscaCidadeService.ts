import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import isNumber from 'is-number';
import { ICidadesRepositorio } from '../repositories/ICidadesRepositorio';
import {
  IRequestBuscaCidadeDTO,
  IResponseBuscaCidadeDTO,
} from '../dtos/IBuscaCidadeDTO';

@injectable()
export default class BuscaCidadeService {
  constructor(
    @inject('CidadesRepositorio')
    private cidadesRepositorio: ICidadesRepositorio,
  ) {}

  public async executa({
    uf,
    nome,
    paginaId = 1,
    resultadosPorPagina = 10,
  }: IRequestBuscaCidadeDTO): Promise<IResponseBuscaCidadeDTO> {
    // Verifica se o id da página foi informado negativo
    // Dificilmente irá lançar esse erro, pois a mesma validação é feita
    // ao receber o request no Schema de validação da rota
    if (isNumber(paginaId)) {
      if (paginaId <= 0) {
        throw new AppError(
          'O número da página informado deve ser no mínimo 1.',
          400,
        );
      }
    }
    if (isNumber(resultadosPorPagina)) {
      if (resultadosPorPagina <= 0) {
        throw new AppError(
          'O número de resultados por página informado deve ser no mínimo 1.',
          400,
        );
      }
    }
    // Realiza a busca
    const {
      cidades,
      paginas,
      resultados,
    } = await this.cidadesRepositorio.procuraPorParams({
      uf,
      nome,
      paginaId,
      resultadosPorPagina,
    });

    if (resultados === 0) {
      throw new AppError(
        'Não foram encontradas cidades com esses critérios.',
        404,
      );
    }

    return { cidades, paginas, resultados };
  }
}
