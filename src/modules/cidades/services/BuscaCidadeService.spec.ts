import AppError from '@shared/errors/AppError';
import FakeEstadosRepositorio from '@modules/estados/repositories/fakes/FakeEstadosRepositorio';
import CriaEstadoService from '@modules/estados/services/CriaEstadoService';
import { EstadosIbge as estadosIBGE } from '@modules/estados/infra/typeorm/seeds/SeedEstados';
import { CidadesIbge as cidadesIBGE } from '@modules/cidades/infra/typeorm/seeds/SeedCidades';
import FakeCidadesRepositorio from '../repositories/fakes/FakeCidadeRepositorio';
import CriaCidadeService from './CriaCidadeService';
import BuscaCidadeService from './BuscaCidadeService';
import Cidade from '../infra/typeorm/entities/Cidade';

describe('Busca de Cidades', () => {
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let fakeCidadesRepositorio: FakeCidadesRepositorio;
  let buscaCidade: BuscaCidadeService;
  let cidades: Cidade[];
  beforeAll(async () => {
    fakeEstadosRepositorio = new FakeEstadosRepositorio();
    fakeCidadesRepositorio = new FakeCidadesRepositorio();
    estadosIBGE.map(async estado => {
      const estadoCriado = await fakeEstadosRepositorio.cria(estado);
      return fakeEstadosRepositorio.salva(estadoCriado);
    });

    cidadesIBGE.map(async cidade => {
      const estado = await fakeEstadosRepositorio.procuraPorUf(cidade.uf);
      if (!estado) {
        return {} as Cidade;
      }

      const novaCidade = await fakeCidadesRepositorio.cria({
        nome: cidade.nome,
        estado,
      });
      return fakeCidadesRepositorio.salva(novaCidade);
    });
    // .filter(async cidade => (await cidade).nome !== 'SEM ESTADO');
  });
  beforeEach(async () => {
    buscaCidade = new BuscaCidadeService(fakeCidadesRepositorio);
  });

  it('Deve poder buscar uma cidade', async () => {
    const response = await buscaCidade.executa({
      nome: 'Farroupilha',
      uf: 'RS',
    });

    const cidadesResultado = response.cidades;

    await expect(cidadesResultado).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ nome: 'Farroupilha' }),
      ]),
    );
  });

  it('Deve poder buscar todas cidades de um UF', async () => {
    const cidadesRS = cidadesIBGE.filter(cidade => cidade.uf === 'RS');
    const response = await buscaCidade.executa({
      uf: 'RS',
      resultadosPorPagina: cidadesRS.length,
    });

    const quantidadeCidades = response.resultados;

    await expect(quantidadeCidades).toBe(cidadesRS.length);
  });

  it('Deve retornar erro caso a página seja enviada incorretamente', async () => {
    expect(
      buscaCidade.executa({
        uf: 'RS',
        paginaId: -1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve retornar erro caso a quantidade de resultados seja enviada incorretamente', async () => {
    expect(
      buscaCidade.executa({
        uf: 'RS',
        resultadosPorPagina: -1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Deve retornar erro caso não encontre cidades com os critérios', async () => {
    expect(
      buscaCidade.executa({
        uf: 'XX',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
