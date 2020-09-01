import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';
import FakeCidadesRepositorio from '@modules/cidades/repositories/fakes/FakeCidadeRepositorio';
import CriaCidadeService from '@modules/cidades/services/CriaCidadeService';
import Estado from '@modules/estados/infra/typeorm/entities/Estado';
import FakeEstadosRepositorio from '@modules/estados/repositories/fakes/FakeEstadosRepositorio';
import CriaEstadoService from '@modules/estados/services/CriaEstadoService';
import AppError from '@shared/errors/AppError';
import Usuario from '../infra/typeorm/entities/Usuario';
import FakeProvedorHash from '../providers/ProvedorHash/fakes/FakeProvedorHash';
import FakeUsuariosRepositorio from '../repositories/fakes/FakeUsuariosRepositorio';
import BuscaUsuarioIdService from './BuscaUsuarioIdService';
import CriaUsuarioService from './CriaUsuarioService';

describe('Busca por Usuário', () => {
  let fakeUsuariosRepositorio: FakeUsuariosRepositorio;
  let fakeProvedorHash: FakeProvedorHash;
  let fakeCidadesRepositorio: FakeCidadesRepositorio;
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let criaUsuario: CriaUsuarioService;
  let criaCidade: CriaCidadeService;
  let criaEstado: CriaEstadoService;
  let buscaUsuario: BuscaUsuarioIdService;
  let cidade: Cidade;
  let estado: Estado;
  let usuario: Usuario;
  beforeEach(async () => {
    fakeUsuariosRepositorio = new FakeUsuariosRepositorio();
    fakeProvedorHash = new FakeProvedorHash();
    fakeCidadesRepositorio = new FakeCidadesRepositorio();
    fakeEstadosRepositorio = new FakeEstadosRepositorio();
    buscaUsuario = new BuscaUsuarioIdService(fakeUsuariosRepositorio);
    criaCidade = new CriaCidadeService(
      fakeCidadesRepositorio,
      fakeEstadosRepositorio,
    );
    criaEstado = new CriaEstadoService(fakeEstadosRepositorio);
    criaUsuario = new CriaUsuarioService(
      fakeUsuariosRepositorio,
      fakeCidadesRepositorio,
      fakeEstadosRepositorio,
      fakeProvedorHash,
    );
    estado = await criaEstado.executa({ nome: 'New York', uf: 'NY' });
    cidade = await criaCidade.executa({ nome: 'Gotham', uf: 'NY' });
    usuario = await criaUsuario.executa({
      nome: 'Joãozinho',
      email: 'joaozinho@email.com',
      bairro: 'Bairro do João',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '123.123.123-12',
      rg: '1234567891',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });
  });

  it('Deve poder consultar um usuário existente', async () => {
    const { id } = usuario;

    const usuarioEncontrado = await buscaUsuario.executa(id);

    await expect(usuarioEncontrado).toBe(usuario);
  });
  it('Não deve poder consultar um usuário inexistente', async () => {
    const { id } = usuario;

    expect(buscaUsuario.executa(id + 1)).rejects.toBeInstanceOf(AppError);
  });
});
