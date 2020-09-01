import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ICriaUsuarioDTO } from '@modules/usuarios/dtos/ICriaUsuarioDTO';
import { IAlteraUsuarioDTO } from '@modules/usuarios/dtos/IAlteraUsuarioDTO';
import CriaUsuarioService from '@modules/usuarios/services/CriaUsuarioService';
import AlteraUsuarioService from '@modules/usuarios/services/AlteraUsuarioService';
import BuscaUsuarioService from '@modules/usuarios/services/BuscaUsuarioService';
import isNumber from 'is-number';
import BuscaUsuarioIdService from '@modules/usuarios/services/BuscaUsuarioIdService';
import EnviaEmailAtivarCadastroService from '@modules/usuarios/services/EnviaEmailAtivarCadastroService';
import AppError from '@shared/errors/AppError';

export default class UsuarioController {
  public async index(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const { nome, cidadeId, cidadeNome, paginaId, uf } = request.query;

    // Tratamento dos parâmetros
    const cidadeIdQuery = !isNumber(cidadeId) ? undefined : Number(cidadeId);
    const cidadeNomeQuery = !cidadeNome ? undefined : String(cidadeNome);
    const paginaIdQuery = !isNumber(paginaId) ? undefined : Number(paginaId);
    const nomeQuery = !nome ? undefined : String(nome);
    const ufQuery = !uf ? undefined : String(uf);

    // Instancia o serviço de busca de usuário
    const buscaUsuario = container.resolve(BuscaUsuarioService);

    // Busca os usuários
    const usuario = await buscaUsuario.executa({
      nome: nomeQuery,
      cidadeId: cidadeIdQuery,
      cidadeNome: cidadeNomeQuery,
      paginaId: paginaIdQuery,
      uf: ufQuery,
    });

    // Retorna um JSON com os usuários encontrados ou um array vazio
    return response.json(usuario);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const { id = 0 } = request.params;
    const usuarioID = isNumber(id) ? Number(id) : 0;

    // Instancia o serviço de busca de usuário
    const buscaUsuario = container.resolve(BuscaUsuarioIdService);

    // Busca os usuários
    const usuario = await buscaUsuario.executa(usuarioID);

    // Retorna um JSON com os usuários encontrados ou um array vazio
    return response.json(usuario);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const dadosUsuario: ICriaUsuarioDTO = request.body;

    // Instancia o serviço de criação de usuários
    const criaUsuario = container.resolve(CriaUsuarioService);

    // Cria o usuário na base de dados
    const usuario = await criaUsuario.executa(dadosUsuario);

    // Instancia o serviço de envio de e-mail
    const enviaEmail = container.resolve(EnviaEmailAtivarCadastroService);

    await enviaEmail.executa(usuario.email);

    // Retorna um JSON com os dados do usuário
    return response.json(usuario);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    // Recebe os dados passados na rota
    const dados: IAlteraUsuarioDTO = request.body;

    // Busca o id do usuário logado
    const { id } = request.usuario;

    // Instancia o serviço de Alteração de usuários
    const alteraUsuario = container.resolve(AlteraUsuarioService);

    // Atualiza o usuário na base de dados
    const usuario = await alteraUsuario.executa({
      ...dados,
      id: Number(id),
    });

    // Retorna um JSON com os dados atualizados do usuário
    return response.json(usuario);
  }
}
