import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IUsuariosRepositorio } from '../repositories/IUsuariosRepositorio';
import Usuario from '../infra/typeorm/entities/Usuario';

@injectable()
export default class BuscaUsuarioIdService {
  constructor(
    @inject('UsuariosRepositorio')
    private usuariosRepositorio: IUsuariosRepositorio,
  ) {}

  public async executa(id: number): Promise<Usuario | undefined> {
    // Realiza a busca
    const usuario = await this.usuariosRepositorio.procuraPeloId(id);

    if (!usuario)
      throw new AppError(`Não foi encontrado um usuário com o id: ${id}`, 404);

    return usuario;
  }
}
