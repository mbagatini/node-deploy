import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetaSenhaService from '@modules/usuarios/services/ResetaSenhaService';

export default class ResetaSenhaController {
  public async create(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const { senha, token } = request.body;

    const resetaSenha = container.resolve(ResetaSenhaService);

    await resetaSenha.executa({ senha, token });

    // Retorna um JSON com os dados do usuário
    return response.status(204).send();
  }
}
