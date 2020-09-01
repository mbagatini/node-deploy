import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AtivaCadastroUsuarioService from '@modules/usuarios/services/AtivaCadastroUsuarioService';

export default class CadastroController {
  public async update(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const { token } = request.query;
    const userToken = String(token);

    // Instancia o serviço de autenticação de usuários
    const ativaCadastroUsuario = container.resolve(AtivaCadastroUsuarioService);

    // faz a autenticação do usuário
    await ativaCadastroUsuario.executa({
      token: userToken,
    });

    // Retorna um JSON com os dados do usuário
    return response.status(204).send();
  }
}
