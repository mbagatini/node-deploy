import { Request, Response } from 'express';
import { container } from 'tsyringe';
import isNumber from 'is-number';
import CriaEstadoService from '@modules/estados/services/CriaEstadoService';
import { ICriaEstadoDTO } from '@modules/estados/dtos/ICriaEstadoDTO';
import BuscaEstadoService from '@modules/estados/services/BuscaEstadoService';

export default class EstadoController {
  public async index(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const { paginaId = 1, resultadosPorPagina = 27 } = request.query;

    // Tratamento dos parâmetros
    const paginaQuery = !isNumber(paginaId) ? undefined : Number(paginaId);
    const resultadosPorPaginaQuery = !isNumber(resultadosPorPagina)
      ? undefined
      : Number(resultadosPorPagina);

    // Instancia o serviço de busca de cidade
    const buscaEstados = container.resolve(BuscaEstadoService);

    // Busca as estados
    const estado = await buscaEstados.executa({
      paginaId: paginaQuery,
      resultadosPorPagina: resultadosPorPaginaQuery,
    });

    // Retorna um JSON com as estados encontradas ou um array vazio
    return response.json(estado);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const dadosEstado: ICriaEstadoDTO = request.body;

    // Instancia o serviço de criação de estados
    const criaEstado = container.resolve(CriaEstadoService);

    // Cria a Estado na base de dados
    const estado = await criaEstado.executa(dadosEstado);

    // Retorna um JSON com os dados do estado
    return response.json(estado);
  }
}
