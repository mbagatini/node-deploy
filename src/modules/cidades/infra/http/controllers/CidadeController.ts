import { Request, Response } from 'express';
import { container } from 'tsyringe';
import isNumber from 'is-number';
import { IRequestDTO } from '@modules/cidades/dtos/ICriaCidadeDTO';
import BuscaCidadeService from '@modules/cidades/services/BuscaCidadeService';
import CriaCidadeService from '@modules/cidades/services/CriaCidadeService';

export default class CidadeController {
  public async index(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const { paginaId = 1, uf, nome, resultadosPorPagina } = request.query;

    // Tratamento dos parâmetros
    const paginaQuery = !isNumber(paginaId) ? undefined : Number(paginaId);
    const nomeQuery = nome ? String(nome) : undefined;
    const ufQuery = String(uf);
    const resultadosPorPaginaQuery = !isNumber(resultadosPorPagina)
      ? undefined
      : Number(resultadosPorPagina);

    // Instancia o serviço de busca de cidade
    const buscaCidades = container.resolve(BuscaCidadeService);

    // Busca as cidades
    const cidade = await buscaCidades.executa({
      paginaId: paginaQuery,
      uf: ufQuery,
      nome: nomeQuery,
      resultadosPorPagina: resultadosPorPaginaQuery,
    });

    // Retorna um JSON com as cidades encontradas ou um array vazio
    return response.json(cidade);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const dadosCidade: IRequestDTO = request.body;

    // Instancia o serviço de criação de usuários
    const criaCidade = container.resolve(CriaCidadeService);

    // Cria a cidade na base de dados
    const cidade = await criaCidade.executa(dadosCidade);

    // Retorna um JSON com os dados do usuário
    return response.json(cidade);
  }
}
