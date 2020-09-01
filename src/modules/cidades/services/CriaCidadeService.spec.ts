import AppError from '@shared/errors/AppError';
import FakeEstadosRepositorio from '@modules/estados/repositories/fakes/FakeEstadosRepositorio';
import CriaEstadoService from '@modules/estados/services/CriaEstadoService';
import FakeCidadesRepositorio from '../repositories/fakes/FakeCidadeRepositorio';
import CriaCidadeService from './CriaCidadeService';

describe('Criação de Cidades', () => {
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let fakeCidadesRepositorio: FakeCidadesRepositorio;
  let criaCidade: CriaCidadeService;
  let criaEstado: CriaEstadoService;
  beforeEach(async () => {
    fakeEstadosRepositorio = new FakeEstadosRepositorio();
    fakeCidadesRepositorio = new FakeCidadesRepositorio();
    criaEstado = new CriaEstadoService(fakeEstadosRepositorio);
    criaCidade = new CriaCidadeService(
      fakeCidadesRepositorio,
      fakeEstadosRepositorio,
    );
    const estado = await criaEstado.executa({
      nome: 'Nova York',
      uf: 'NY',
    });
  });
  it('Deve poder criar uma cidade', async () => {
    const cidade = await criaCidade.executa({
      nome: ' City',
      uf: 'NY',
    });

    await expect(cidade).toHaveProperty('id', 1);
  });
  it('Não deve poder criar uma cidade existente', async () => {
    await criaCidade.executa({
      nome: ' City',
      uf: 'NY',
    });
    await expect(
      criaCidade.executa({
        nome: ' City',
        uf: 'NY',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve poder criar uma cidade com um estado inexistente', async () => {
    await expect(
      criaCidade.executa({
        nome: ' City',
        uf: 'XX',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
