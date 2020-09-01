import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import isNumber from 'is-number';
import {
  IRequestBuscaEstadoDTO,
  IResponseBuscaEstadoDTO,
} from '../dtos/IBuscaEstadoDTO';
import { IEstadosRepositorio } from '../repositories/IEstadosRepositorio';

@injectable()
export default class BuscaEstadoService {
  constructor(
    @inject('EstadosRepositorio')
    private EstadosRepositorio: IEstadosRepositorio,
  ) {}

  public async executa({
    paginaId = 1,
    resultadosPorPagina = 27,
  }: IRequestBuscaEstadoDTO): Promise<IResponseBuscaEstadoDTO> {
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
      if (resultadosPorPagina <= 0 || resultadosPorPagina > 27) {
        throw new AppError(
          'A quantide de resultados por página deve ser entre 0 e 27',
          400,
        );
      }
    }
    // Realiza a busca
    const {
      estados,
      paginas,
      resultados,
    } = await this.EstadosRepositorio.procuraPorParams({
      paginaId,
      resultadosPorPagina,
    });

    if (!estados || resultados === 0) {
      throw new AppError(
        'Não foram encontradas Estados com esses critérios.',
        404,
      );
    }

    return { estados, paginas, resultados };
  }
}
