import AppError from '@shared/errors/AppError';
import { EstadosIbge as estadosIBGE } from '@modules/estados/infra/typeorm/seeds/SeedEstados';
import FakeEstadosRepositorio from '../repositories/fakes/FakeEstadosRepositorio';
import BuscaEstadoService from './BuscaEstadoService';

describe('Busca de Estados', () => {
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let buscaEstado: BuscaEstadoService;
  beforeAll(async () => {
    fakeEstadosRepositorio = new FakeEstadosRepositorio();
    buscaEstado = new BuscaEstadoService(fakeEstadosRepositorio);
    estadosIBGE.map(async estado => {
      const estadoCriado = await fakeEstadosRepositorio.cria(estado);
      return fakeEstadosRepositorio.salva(estadoCriado);
    });
  });
  it('Deve retornar 27 estados se não especificar quantos resultados por página', async () => {
    const { resultados } = await buscaEstado.executa({});

    await expect(resultados).toBe(27);
  });
  it('Deve retornar 10 estados se especificar quantos resultados por página', async () => {
    const { estados } = await buscaEstado.executa({ resultadosPorPagina: 10 });

    await expect(estados).toHaveLength(10);
  });
  it('Não deve poder consultar usuários com um id de página inválido', async () => {
    await expect(
      buscaEstado.executa({
        paginaId: -1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Deve retornar erro caso não encontrar resultados com os critérios', async () => {
    await expect(
      buscaEstado.executa({
        paginaId: 10,
        resultadosPorPagina: 27,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Deve retornar erro caso informar uma quantidade de resultados por página inválida', async () => {
    await expect(
      buscaEstado.executa({
        resultadosPorPagina: -1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
