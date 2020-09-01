import AppError from '@shared/errors/AppError';
import FakeCidadesRepositorio from '@modules/cidades/repositories/fakes/FakeCidadeRepositorio';
import FakeEstadosRepositorio from '@modules/estados/repositories/fakes/FakeEstadosRepositorio';
import CriaCidadeService from '@modules/cidades/services/CriaCidadeService';
import CriaEstadoService from '@modules/estados/services/CriaEstadoService';
import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';
import Estado from '@modules/estados/infra/typeorm/entities/Estado';
import FakeProvedorToken from '@shared/providers/ProvedorToken/fakes/FakeProvedorToken';
import FakeUsuariosRepositorio from '../repositories/fakes/FakeUsuariosRepositorio';
import CriaUsuarioService from './CriaUsuarioService';
import FakeProvedorHash from '../providers/ProvedorHash/fakes/FakeProvedorHash';
import AutenticaUsuarioService from './AutenticaUsuarioService';
import FakeTokensUsuarioRepositorio from '../repositories/fakes/FakeTokensUsuarioRepositorio';
import Usuario from '../infra/typeorm/entities/Usuario';
import AtivaCadastroUsuarioService from './AtivaCadastroUsuarioService';

describe('Autenticação de Usuário', () => {
  let fakeUsuariosRepositorio: FakeUsuariosRepositorio;
  let fakeTokensUsuarioRepositorio: FakeTokensUsuarioRepositorio;
  let fakeProvedorHash: FakeProvedorHash;
  let fakeProvedorToken: FakeProvedorToken;
  let fakeCidadesRepositorio: FakeCidadesRepositorio;
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let criaUsuario: CriaUsuarioService;
  let autenticaUsuario: AutenticaUsuarioService;
  let criaCidade: CriaCidadeService;
  let criaEstado: CriaEstadoService;
  let ativaCadastro: AtivaCadastroUsuarioService;
  let cidade: Cidade;
  let estado: Estado;
  let usuario: Usuario;
  beforeEach(async () => {
    fakeUsuariosRepositorio = new FakeUsuariosRepositorio();
    fakeTokensUsuarioRepositorio = new FakeTokensUsuarioRepositorio();
    fakeProvedorToken = new FakeProvedorToken();
    fakeProvedorHash = new FakeProvedorHash();
    fakeCidadesRepositorio = new FakeCidadesRepositorio();
    fakeEstadosRepositorio = new FakeEstadosRepositorio();
    ativaCadastro = new AtivaCadastroUsuarioService(
      fakeUsuariosRepositorio,
      fakeTokensUsuarioRepositorio,
    );
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
    autenticaUsuario = new AutenticaUsuarioService(
      fakeUsuariosRepositorio,
      fakeProvedorHash,
      fakeProvedorToken,
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

  it('Não deve poder autenticar um usuário inativo', async () => {
    await expect(
      autenticaUsuario.executa({
        email: usuario.email,
        senha: usuario.senha,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Deve poder autenticar um usuário ativo', async () => {
    const tokenAutenticacao = await fakeTokensUsuarioRepositorio.criaToken(
      usuario,
    );

    await ativaCadastro.executa({ token: tokenAutenticacao });

    const { token } = await autenticaUsuario.executa({
      email: usuario.email,
      senha: usuario.senha,
    });
    await expect(token).toBeDefined();
  });
  it('Não deve poder autenticar um usuário ativo com email incorreto', async () => {
    const token = await fakeTokensUsuarioRepositorio.criaToken(usuario);

    await ativaCadastro.executa({ token });

    await expect(
      autenticaUsuario.executa({
        email: 'incorreto',
        senha: usuario.senha,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve poder autenticar um usuário ativo com senha incorreta', async () => {
    const token = await fakeTokensUsuarioRepositorio.criaToken(usuario);

    await ativaCadastro.executa({ token });

    await expect(
      autenticaUsuario.executa({
        email: usuario.email,
        senha: 'incorreta',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
