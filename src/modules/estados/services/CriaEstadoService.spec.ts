import AppError from '@shared/errors/AppError';
import FakeEstadosRepositorio from '../repositories/fakes/FakeEstadosRepositorio';
import CriaEstadoService from './CriaEstadoService';

describe('Criação de Estados', () => {
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let criaEstado: CriaEstadoService;
  beforeEach(async () => {
    fakeEstadosRepositorio = new FakeEstadosRepositorio();
    criaEstado = new CriaEstadoService(fakeEstadosRepositorio);
  });
  it('Deve poder criar um estado que não exista', async () => {
    const estado = await criaEstado.executa({
      nome: 'Nova York',
      uf: 'NY',
    });

    await expect(estado).toHaveProperty('id', 1);
  });
  it('Não deve poder criar um estado com um UF que já exista', async () => {
    await criaEstado.executa({
      nome: 'Nova York',
      uf: 'NY',
    });

    // Mesmo UF
    await expect(
      criaEstado.executa({
        nome: 'Outra cidade',
        uf: 'NY',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve poder criar um estado com um nome que já exista', async () => {
    await criaEstado.executa({
      nome: 'Nova York',
      uf: 'NY',
    });

    // Mesmo nome
    await expect(
      criaEstado.executa({
        nome: 'Nova York',
        uf: 'SP',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
