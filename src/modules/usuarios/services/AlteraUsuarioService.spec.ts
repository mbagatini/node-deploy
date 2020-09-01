import AppError from '@shared/errors/AppError';
import FakeCidadesRepositorio from '@modules/cidades/repositories/fakes/FakeCidadeRepositorio';
import FakeEstadosRepositorio from '@modules/estados/repositories/fakes/FakeEstadosRepositorio';
import CriaCidadeService from '@modules/cidades/services/CriaCidadeService';
import CriaEstadoService from '@modules/estados/services/CriaEstadoService';
import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';
import Estado from '@modules/estados/infra/typeorm/entities/Estado';
import moment from 'moment';
import FakeUsuariosRepositorio from '../repositories/fakes/FakeUsuariosRepositorio';
import CriaUsuarioService from './CriaUsuarioService';
import FakeProvedorHash from '../providers/ProvedorHash/fakes/FakeProvedorHash';
import AlteraUsuarioService from './AlteraUsuarioService';

describe('Alteração de Usuário', () => {
  let fakeUsuariosRepositorio: FakeUsuariosRepositorio;
  let fakeProvedorHash: FakeProvedorHash;
  let fakeCidadesRepositorio: FakeCidadesRepositorio;
  let fakeEstadosRepositorio: FakeEstadosRepositorio;
  let criaUsuario: CriaUsuarioService;
  let alteraUsuario: AlteraUsuarioService;
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
    alteraUsuario = new AlteraUsuarioService(
      fakeUsuariosRepositorio,
      fakeCidadesRepositorio,
      fakeEstadosRepositorio,
      fakeProvedorHash,
    );
    criaEstado = new CriaEstadoService(fakeEstadosRepositorio);
    criaUsuario = new CriaUsuarioService(
      fakeUsuariosRepositorio,
      fakeCidadesRepositorio,
      fakeEstadosRepositorio,
      fakeProvedorHash,
    );
    estado = await criaEstado.executa({ nome: 'Nova York', uf: 'NY' });
    cidade = await criaCidade.executa({ nome: 'Gotham', uf: 'NY' });
  });

  it('Deve poder alterar a senha de um usuário', async () => {
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

    const { id } = usuario;

    await alteraUsuario.executa({
      senha: '111111',
      senha_antiga: '123456',
      id,
    });

    const novaSenha = await fakeUsuariosRepositorio.retornaSenha(id);

    const checkSenha = await fakeProvedorHash.comparaHash(
      '111111',
      novaSenha || 'não achou o user',
    );

    await expect(checkSenha).toBe(true);
  });
  it('Deve poder alterar o bairro de um usuário', async () => {
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

    const { id } = usuario;

    const { bairro } = await alteraUsuario.executa({
      bairro: 'Bairro Novo',
      id,
    });

    await expect(bairro).toBe('Bairro Novo');
  });
  it('Deve poder alterar o cep de um usuário', async () => {
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

    const { id } = usuario;

    const { cep } = await alteraUsuario.executa({
      cep: '98745-987',
      id,
    });

    await expect(cep).toBe('98745-987');
  });
  it('Deve poder alterar o complemento de um usuário', async () => {
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

    const { id } = usuario;

    const { complemento } = await alteraUsuario.executa({
      complemento: 'Atrás da Igreja',
      id,
    });

    await expect(complemento).toBe('Atrás da Igreja');
  });
  it('Deve poder alterar o endereco de um usuário', async () => {
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

    const { id } = usuario;

    const { endereco } = await alteraUsuario.executa({
      endereco: 'Rua Pinheiro Machado',
      id,
    });

    await expect(endereco).toBe('Rua Pinheiro Machado');
  });
  it('Deve poder alterar o número do endereço de um usuário', async () => {
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

    const { id } = usuario;

    const { numero } = await alteraUsuario.executa({
      numero: '99',
      id,
    });

    await expect(numero).toBe('99');
  });
  it('Deve poder alterar o nome de um usuário', async () => {
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

    const { id } = usuario;

    const { nome } = await alteraUsuario.executa({
      nome: 'Jonas',
      id,
    });

    await expect(nome).toBe('Jonas');
  });
  it('Deve poder alterar a data de nascimento de um usuário', async () => {
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

    const { id } = usuario;

    const { data_nascimento } = await alteraUsuario.executa({
      data_nascimento: '2020-01-01',
      id,
    });

    await expect(moment(data_nascimento).format('YYYY-MM-DD')).toBe(
      '2020-01-01',
    );
  });
  it('Não deve poder alterar a senha de um usuário quando não informada a senha antiga', async () => {
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

    const { id } = usuario;

    await expect(
      alteraUsuario.executa({
        senha: '111111',
        id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve poder alterar um usuário que não existe', async () => {
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

    const { id } = usuario;

    await expect(
      alteraUsuario.executa({
        nome: 'Errônio',
        id: id + 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve poder alterar o cpf de um usuário para um cpf já cadastrado', async () => {
    await criaUsuario.executa({
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

    const usuario = await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567892',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    const { id } = usuario;

    await expect(
      alteraUsuario.executa({
        cpf: '123.123.123-12',
        id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Deve poder alterar o cpf de um usuário', async () => {
    const usuario = await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567892',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    const { id } = usuario;

    await alteraUsuario.executa({
      cpf: '123.123.123-12',
      id,
    });

    const usuarioSalvo = await fakeUsuariosRepositorio.procuraPeloId(id);

    let cpf: string;
    if (!usuarioSalvo) {
      cpf = 'não achou o usuário';
    } else {
      cpf = usuarioSalvo.cpf;
    }

    await expect(cpf).toBe('123.123.123-12');
  });
  it('Não deve poder alterar o rg de um usuário para um rg já cadastrado', async () => {
    await criaUsuario.executa({
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

    const usuario = await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567892',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    const { id } = usuario;

    await expect(
      alteraUsuario.executa({
        rg: '1234567891',
        id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Deve poder alterar o rg de um usuário', async () => {
    const usuario = await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567892',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    const { id } = usuario;

    await alteraUsuario.executa({
      rg: '1234567891',
      id,
    });

    const usuarioSalvo = await fakeUsuariosRepositorio.procuraPeloId(id);

    let rg: string;
    if (!usuarioSalvo) {
      rg = 'não achou o usuário';
    } else {
      rg = usuarioSalvo.rg;
    }

    await expect(rg).toBe('1234567891');
  });
  it('Não deve poder alterar a cidade de um usuário para uma cidade que não existe', async () => {
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

    const { id } = usuario;
    await expect(
      alteraUsuario.executa({
        cidade: {
          ...cidade,
          nome: 'Inexistentelandia',
        },
        id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Deve poder alterar a cidade de um usuário', async () => {
    const usuario = await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567892',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    const cidadeNova = await criaCidade.executa({
      nome: 'Metrópolis',
      uf: 'NY',
    });

    const { id } = usuario;

    await alteraUsuario.executa({
      cidade: cidadeNova,
      id,
    });

    const usuarioSalvo = await fakeUsuariosRepositorio.procuraPeloId(id);
    const cidadeUsuario = usuarioSalvo?.cidade;

    await expect(cidadeUsuario).toMatchObject<Cidade>(cidadeNova);
  });
  it('Não deve poder alterar a senha caso a senha atual esteja incorreta', async () => {
    const usuario = await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567892',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    const { id } = usuario;
    await expect(
      alteraUsuario.executa({
        senha: '111111',
        senha_antiga: 'incorreta',
        id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Não deve poder alterar a cidade caso o estado não existe', async () => {
    const usuario = await criaUsuario.executa({
      nome: 'Fulaninho',
      email: 'fulaninho@email.com',
      bairro: 'Bairro do Fulaninho',
      cep: '95874-859',
      cidade,
      complemento: 'apto 501',
      cpf: '321.321.321-32',
      rg: '1234567892',
      data_nascimento: '2020-05-20',
      endereco: 'Rua do Joãozinho',
      numero: '42',
      senha: '123456',
    });

    const { id } = usuario;
    await expect(
      alteraUsuario.executa({
        id,
        cidade: {
          ...cidade,
          estado: {
            ...estado,
            uf: 'XX',
          },
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
