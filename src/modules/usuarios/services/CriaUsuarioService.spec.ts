import AppError from '@shared/errors/AppError';
import FakeCidadesRepositorio from '@modules/cidades/repositories/fakes/FakeCidadeRepositorio';
import FakeEstadosRepositorio from '@modules/estados/repositories/fakes/FakeEstadosRepositorio';
import CriaCidadeService from '@modules/cidades/services/CriaCidadeService';
import CriaEstadoService from '@modules/estados/services/CriaEstadoService';
import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';
import Estado from '@modules/estados/infra/typeorm/entities/Estado';
import FakeUsuariosRepositorio from '../repositories/fakes/FakeUsuariosRepositorio';
import CriaUsuarioService from './CriaUsuarioService';
import FakeProvedorHash from '../providers/ProvedorHash/fakes/FakeProvedorHash';
import { StatusUsuario } from '../dtos/EStatusUsuario';

describe('Criação de Usuário', () => {
  let fakeUsuariosRepositorio: FakeUsuariosRepositorio;
  let fakeProvedorHash: FakeProvedorHash;
  let fakeCidadesRepositorio: FakeCidadesRepositorio;
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let criaUsuario: CriaUsuarioService;
  let criaCidade: CriaCidadeService;
  let criaEstado: CriaEstadoService;
  let cidade: Cidade;
  let estado: Estado;
  beforeEach(async () => {
    fakeUsuariosRepositorio = new FakeUsuariosRepositorio();
    fakeProvedorHash = new FakeProvedorHash();
    fakeCidadesRepositorio = new FakeCidadesRepositorio();
    fakeEstadosRepositorio = new FakeEstadosRepositorio();
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
    estado = await criaEstado.executa({ nome: 'Estados Unidos', uf: 'US' });
    cidade = await criaCidade.executa({ nome: 'Gotham', uf: 'US' });
  });

  it('deve poder criar um usuário', async () => {
    const usuario = await criaUsuario.executa({
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

    await expect(usuario).toHaveProperty('id');
  });
  it('deve criar o usuário com status "inativo"', async () => {
    const usuario = await criaUsuario.executa({
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
    const { status } = usuario;
    await expect(status).toBe(StatusUsuario.INATIVO);
  });
  it('Não deve poder criar um usuário com um rg já cadastrado', async () => {
    await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567891',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    expect(
      criaUsuario.executa({
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve poder criar um usuário com um cpf já cadastrado', async () => {
    await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567891',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    await expect(
      criaUsuario.executa({
        nome: 'Joãozinho',
        email: 'joaozinho@email.com',
        bairro: 'Bairro do João',
        cep: '95874-859',
        cidade,
        complemento: 'apto 501',
        cpf: '321.321.321-32',
        rg: '4645667891',
        data_nascimento: '2020-05-20',
        endereco: 'Rua do Joãozinho',
        numero: '42',
        senha: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve poder criar um usuário com um email já cadastrado', async () => {
    await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567891',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    await expect(
      criaUsuario.executa({
        nome: 'Joãozinho',
        email: 'fulaninho@email.com',
        bairro: 'Bairro do João',
        cep: '95874-859',
        cidade,
        complemento: 'apto 501',
        cpf: '123.321.321-32',
        rg: '4645667891',
        data_nascimento: '2020-05-20',
        endereco: 'Rua do Joãozinho',
        numero: '42',
        senha: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve poder criar um usuário com uma cidade não cadastrada', async () => {
    const cidadeInexistente: Cidade = {
      ...cidade,
      nome: 'Inexistentelandia',
    };

    await expect(
      criaUsuario.executa({
        nome: 'Joãozinho',
        email: 'fulaninho@email.com',
        bairro: 'Bairro do João',
        cep: '95874-859',
        cidade: cidadeInexistente,
        complemento: 'apto 501',
        cpf: '123.321.321-32',
        rg: '4645667891',
        data_nascimento: '2020-05-20',
        endereco: 'Rua do Joãozinho',
        numero: '42',
        senha: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
