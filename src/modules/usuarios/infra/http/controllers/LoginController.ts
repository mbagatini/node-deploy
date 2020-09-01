import { Request, Response } from 'express';
import { container } from 'tsyringe';
import {
  IRequestLoginDTO,
  IResponseLoginDTO,
} from '@modules/usuarios/dtos/ILoginDTO';
import AutenticaUsuarioService from '@modules/usuarios/services/AutenticaUsuarioService';

export default class LoginController {
  public async create(request: Request, response: Response): Promise<Response> {
    // Recebe os dados do request
    const { email, senha }: IRequestLoginDTO = request.body;

    // Instancia o serviço de autenticação de usuários
    const autenticaUsuario = container.resolve(AutenticaUsuarioService);

    // faz a autenticação do usuário
    const {
      token,
      usuario,
    }: IResponseLoginDTO = await autenticaUsuario.executa({
      email,
      senha,
    });

    // Retorna um JSON com os dados do usuário
    return response.json({ usuario, token });
  }
}
