import Usuario from '../infra/typeorm/entities/Usuario';

export interface IRequestLoginDTO {
  email: string;
  senha: string;
}

export interface IResponseLoginDTO {
  usuario: Usuario;
  token: string;
}
