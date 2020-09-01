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
import TokensUsuario from '../infra/typeorm/entities/TokensUsuario';
import ResetaSenhaService from './ResetaSenhaService';

describe('Reset de senha de um Usuário', () => {
  let fakeUsuariosRepositorio: FakeUsuariosRepositorio;
  let fakeTokensUsuarioRepositorio: FakeTokensUsuarioRepositorio;
  let fakeProvedorHash: FakeProvedorHash;
  let fakeProvedorToken: FakeProvedorToken;
  let fakeCidadesRepositorio: FakeCidadesRepositorio;
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let criaUsuario: CriaUsuarioService;
  let ativaCadastro: AtivaCadastroUsuarioService;
  let criaCidade: CriaCidadeService;
  let criaEstado: CriaEstadoService;
  let resetaSenha: ResetaSenhaService;
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
    resetaSenha = new ResetaSenhaService(
      fakeProvedorHash,
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

    const tokenAtivacao = await fakeTokensUsuarioRepositorio.criaToken(usuario);
    await ativaCadastro.executa({ token: tokenAtivacao });
  });

  it('Deve poder resetar a senha de um usuário com um token válido', async () => {
    const token = await fakeTokensUsuarioRepositorio.criaToken(usuario);
    const { senha } = usuario;
    await expect(
      resetaSenha.executa({
        token,
        senha,
      }),
    ).resolves.toBeUndefined();
  });
  it('Não deve resetar a senha de um usuário com um token que não foi encontrado.', async () => {
    const { senha } = usuario;
    await expect(
      resetaSenha.executa({
        token: 'ehuehuehue',
        senha,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve resetar a senha de um usuário com um token expirado.', async () => {
    // Altera o retorno da função para testar se ocorrerá erro
    const { senha } = usuario;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const novaData = new Date();

      return novaData.setHours(novaData.getHours() + 3);
    });

    const token = await fakeTokensUsuarioRepositorio.criaToken(usuario);

    await expect(
      resetaSenha.executa({
        token,
        senha,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve resetar a senha de um usuário inexistente.', async () => {
    // Altera o retorno da função para testar se ocorrerá erro
    const { senha } = usuario;
    jest
      .spyOn(fakeUsuariosRepositorio, 'procuraPeloId')
      .mockImplementationOnce(async () => undefined);

    const token = await fakeTokensUsuarioRepositorio.criaToken(usuario);

    await expect(
      resetaSenha.executa({
        token,
        senha,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve resetar a senha de um usuário inativo.', async () => {
    usuario = await criaUsuario.executa({
      nome: 'Errônio',
      email: 'erroniodasilva@email.com',
      bairro: 'Bairro do João',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '123.123.223-12',
      rg: '1234567291',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    const token = await fakeTokensUsuarioRepositorio.criaToken(usuario);
    const { senha } = usuario;
    await expect(
      resetaSenha.executa({
        token,
        senha,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
