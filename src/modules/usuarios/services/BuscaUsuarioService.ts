import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import isNumber from 'is-number';
import { IUsuariosRepositorio } from '../repositories/IUsuariosRepositorio';
import {
  IRequestBuscaUsuarioDTO,
  IResponseBuscaUsuarioDTO,
} from '../dtos/IBuscaUsuarioDTO';

@injectable()
export default class BuscaUsuarioService {
  constructor(
    @inject('UsuariosRepositorio')
    private usuariosRepositorio: IUsuariosRepositorio,
  ) {}

  public async executa({
    nome,
    cidadeId,
    uf,
    paginaId = 1,
    cidadeNome,
    resultadosPorPagina = 10,
  }: IRequestBuscaUsuarioDTO): Promise<IResponseBuscaUsuarioDTO> {
    // Essa validação é feita no UsuárioSchema, mas faz o teste mesmo assim para
    // evitar que busque por todos usuários sem nenhum parâmetro.
    if (!nome && !cidadeId && !uf && !cidadeNome) {
      throw new AppError(
        'Pelo menos 1 parâmetro deve ser informado para a pesquisa.',
        400,
      );
    }

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
          'A quantide de resultados por página deve ser maior que 0',
          400,
        );
      }
    }
    // Realiza a busca
    const {
      usuarios,
      paginas,
      resultados,
    } = await this.usuariosRepositorio.procuraPorParams({
      nome,
      cidadeId,
      uf,
      cidadeNome,
      paginaId,
      resultadosPorPagina,
    });

    if (!usuarios || usuarios.length === 0) {
      throw new AppError(
        'Não foram encontrados usuários com esses critérios.',
        404,
      );
    }

    return { usuarios, paginas, resultados };
  }
}
