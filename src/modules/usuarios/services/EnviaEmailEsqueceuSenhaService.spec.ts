import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';
import FakeCidadesRepositorio from '@modules/cidades/repositories/fakes/FakeCidadeRepositorio';
import CriaCidadeService from '@modules/cidades/services/CriaCidadeService';
import Estado from '@modules/estados/infra/typeorm/entities/Estado';
import FakeEstadosRepositorio from '@modules/estados/repositories/fakes/FakeEstadosRepositorio';
import CriaEstadoService from '@modules/estados/services/CriaEstadoService';
import AppError from '@shared/errors/AppError';
import FakeProvedorEmail from '@shared/providers/ProvedorEmail/fakes/FakeProvedorEmail';
import Usuario from '../infra/typeorm/entities/Usuario';
import FakeProvedorHash from '../providers/ProvedorHash/fakes/FakeProvedorHash';
import FakeTokensUsuarioRepositorio from '../repositories/fakes/FakeTokensUsuarioRepositorio';
import FakeUsuariosRepositorio from '../repositories/fakes/FakeUsuariosRepositorio';
import CriaUsuarioService from './CriaUsuarioService';
import EnviaEmailEsqueceuSenhaService from './EnviaEmailEsqueceuSenhaService';

describe('Envia e-mail de ativação do cadastro', () => {
  let fakeUsuariosRepositorio: FakeUsuariosRepositorio;
  let fakeProvedorEmail: FakeProvedorEmail;
  let fakeProvedorHash: FakeProvedorHash;
  let fakeTokensRepositorio: FakeTokensUsuarioRepositorio;
  let fakeCidadesRepositorio: FakeCidadesRepositorio;
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let criaCidade: CriaCidadeService;
  let criaEstado: CriaEstadoService;
  let criaUsuario: CriaUsuarioService;
  let enviaEmailEsqueceuSenhaService: EnviaEmailEsqueceuSenhaService;
  let cidade: Cidade;
  let estado: Estado;
  let usuario: Usuario;
  beforeEach(async () => {
    fakeUsuariosRepositorio = new FakeUsuariosRepositorio();
    fakeProvedorEmail = new FakeProvedorEmail();
    fakeProvedorHash = new FakeProvedorHash();
    fakeCidadesRepositorio = new FakeCidadesRepositorio();
    fakeTokensRepositorio = new FakeTokensUsuarioRepositorio();
    fakeEstadosRepositorio = new FakeEstadosRepositorio();
    enviaEmailEsqueceuSenhaService = new EnviaEmailEsqueceuSenhaService(
      fakeProvedorEmail,
      fakeUsuariosRepositorio,
      fakeTokensRepositorio,
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
  });

  it('Deve poder enviar email de esquecimento de senha', async () => {
    const { email } = usuario;

    const enviouEmail = jest.spyOn(fakeProvedorEmail, 'enviaEmail');

    await enviaEmailEsqueceuSenhaService.executa(email);

    await expect(enviouEmail).toHaveBeenCalledTimes(1);
  });
  it('Não deve tentar enviar email de ativacao de cadastro quando não encontrar o usuário do email', async () => {
    const { email } = usuario;

    const procuraEmail = jest.spyOn(
      fakeUsuariosRepositorio,
      'procuraPeloEmail',
    );

    procuraEmail.mockImplementationOnce(async () => undefined);

    await expect(
      enviaEmailEsqueceuSenhaService.executa(email),
    ).rejects.toBeInstanceOf(AppError);
  });
});
