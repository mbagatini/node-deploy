import { Request, Response } from 'express';
import { container } from 'tsyringe';
import EnviaEmailEsqueceuSenhaService from '@modules/usuarios/services/EnviaEmailEsqueceuSenhaService';

export default class EsqueceuSenhaController {
  public async create(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const { email } = request.body;

    const enviaEmail = container.resolve(EnviaEmailEsqueceuSenhaService);

    // Envia o e-mail
    await enviaEmail.executa(email);

    // Retorna um JSON com os dados do usuário
    return response.status(204).send();
  }
}
