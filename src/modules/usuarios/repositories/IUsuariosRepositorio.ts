import Usuario from '../infra/typeorm/entities/Usuario';
import { ICriaUsuarioDTO } from '../dtos/ICriaUsuarioDTO';
import {
  IRequestBuscaUsuarioDTO,
  IResponseBuscaUsuarioDTO,
} from '../dtos/IBuscaUsuarioDTO';

export interface IUsuariosRepositorio {
  retornaSenha(id: number): Promise<string | undefined>;
  procuraPeloId(id: number, senha?: boolean): Promise<Usuario | undefined>;
  procuraPeloEmail(
    email: string,
    senha?: boolean,
  ): Promise<Usuario | undefined>;
  procuraPeloCpf(cpf: string): Promise<Usuario | undefined>;
  procuraPeloRg(rg: string): Promise<Usuario | undefined>;
  procuraPorParams(
    params: IRequestBuscaUsuarioDTO,
  ): Promise<IResponseBuscaUsuarioDTO>;
  cria(dados: ICriaUsuarioDTO): Promise<Usuario>;
  salva(usuario: Usuario): Promise<Usuario>;
}
