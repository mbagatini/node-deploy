import AppError from '@shared/errors/AppError';
import FakeCidadesRepositorio from '@modules/cidades/repositories/fakes/FakeCidadeRepositorio';
import FakeEstadosRepositorio from '@modules/estados/repositories/fakes/FakeEstadosRepositorio';
import CriaCidadeService from '@modules/cidades/services/CriaCidadeService';
import CriaEstadoService from '@modules/estados/services/CriaEstadoService';
import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';
import FakeUsuariosRepositorio from '../repositories/fakes/FakeUsuariosRepositorio';
import CriaUsuarioService from './CriaUsuarioService';
import FakeProvedorHash from '../providers/ProvedorHash/fakes/FakeProvedorHash';
import Usuario from '../infra/typeorm/entities/Usuario';
import BuscaUsuarioService from './BuscaUsuarioService';

describe('Busca de Usuários', () => {
  let fakeUsuariosRepositorio: FakeUsuariosRepositorio;
  let fakeProvedorHash: FakeProvedorHash;
  let fakeCidadesRepositorio: FakeCidadesRepositorio;
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let criaUsuario: CriaUsuarioService;
  let criaCidade: CriaCidadeService;
  let criaEstado: CriaEstadoService;
  let buscaUsuario: BuscaUsuarioService;
  let usuarioRs: Usuario;
  let usuarioSc: Usuario;
  let usuarioSp: Usuario;
  let cidade1: Cidade;
  let cidade2: Cidade;
  let cidade3: Cidade;
  beforeEach(async () => {
    fakeUsuariosRepositorio = new FakeUsuariosRepositorio();
    fakeProvedorHash = new FakeProvedorHash();
    fakeCidadesRepositorio = new FakeCidadesRepositorio();
    fakeEstadosRepositorio = new FakeEstadosRepositorio();
    buscaUsuario = new BuscaUsuarioService(fakeUsuariosRepositorio);
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
    await criaEstado.executa({ nome: 'Santa Catarina', uf: 'SC' });
    await criaEstado.executa({ nome: 'São Paulo', uf: 'SP' });
    await criaEstado.executa({ nome: 'Rio Grande do Sul', uf: 'RS' });
    cidade1 = await criaCidade.executa({ nome: 'Farroupilha', uf: 'RS' });
    cidade2 = await criaCidade.executa({ nome: 'Floripa', uf: 'SC' });
    cidade3 = await criaCidade.executa({
      nome: 'Mogi das Cruzes',
      uf: 'SP',
    });
    usuarioRs = await criaUsuario.executa({
      nome: 'Joãozinho',
      email: 'joaozinho@email.com',
      bairro: 'Bairro do João',
      cep: '95874-859',
      cidade: cidade1,
      complemento: 'apto 501',
      cpf: '123.123.123-12',
      rg: '1234567891',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    usuarioSc = await criaUsuario.executa({
      nome: 'Batman Eterno',
      email: 'batman@email.com',
      bairro: 'Bairro do Batman',
      cep: '95874-859',
      cidade: cidade2,
      complemento: 'apto 501',
      cpf: '123.123.111-12',
      rg: '1234227891',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Batman',
      numero: '42',
      senha: '123456',
    });

    usuarioSp = await criaUsuario.executa({
      nome: 'Robin',
      email: 'Robin@email.com',
      bairro: 'Bairro do Robin',
      cep: '95874-859',
      cidade: cidade3,
      complemento: 'apto 501',
      cpf: '123.123.222-12',
      rg: '1234221891',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Robin',
      numero: '42',
      senha: '123456',
    });
  });

  it('Deve poder consultar usuários por uf existente', async () => {
    const { usuarios } = await buscaUsuario.executa({
      uf: 'RS',
    });

    await expect(usuarios).toMatchObject<Usuario[]>([usuarioRs]);
  });
  it('Deve poder consultar usuários por um id de cidade', async () => {
    const { usuarios } = await buscaUsuario.executa({
      cidadeId: cidade2.id,
    });

    await expect(usuarios).toMatchObject<Usuario[]>([usuarioSc]);
  });
  it('Deve poder consultar usuários por um nome de cidade', async () => {
    const { usuarios } = await buscaUsuario.executa({
      cidadeNome: cidade3.nome,
    });

    await expect(usuarios).toMatchObject<Usuario[]>([usuarioSp]);
  });
  it('Deve poder consultar usuários por nome', async () => {
    const { usuarios } = await buscaUsuario.executa({
      nome: usuarioSc.nome,
    });

    await expect(usuarios).toMatchObject<Usuario[]>([usuarioSc]);
  });
  it('Deve poder consultar usuários por parte do nome', async () => {
    const { usuarios } = await buscaUsuario.executa({
      nome: 'Eterno',
    });

    await expect(usuarios).toMatchObject<Usuario[]>([usuarioSc]);
  });
  it('Não Deve poder consultar usuários passando uma paginaId menor que zero', async () => {
    await expect(
      buscaUsuario.executa({
        paginaId: -1,
        uf: 'RS',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não Deve poder consultar usuários sem passar nenhum parâmetro', async () => {
    await expect(buscaUsuario.executa({})).rejects.toBeInstanceOf(AppError);
  });
  it('Não Deve poder consultar usuários passando um número de resultados por página inválido', async () => {
    await expect(
      buscaUsuario.executa({ resultadosPorPagina: -1, uf: 'RS' }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Deve retornar erro caso nenhum usuário seja encontrado', async () => {
    await expect(
      buscaUsuario.executa({
        uf: 'ops',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Deve poder consultar usuários de outra página', async () => {
    const novoUsuario = await criaUsuario.executa({
      ...usuarioSc,
      data_nascimento: '2020-05-20',
      email: 'novouser@email.com',
      cpf: '789.789.789-11',
      rg: '1478523698',
      cidade: cidade1,
    });
    const { usuarios } = await buscaUsuario.executa({
      uf: 'RS',
      paginaId: 2,
      resultadosPorPagina: 1,
    });

    expect(usuarios).toMatchObject<Usuario[]>([novoUsuario]);
  });
});
