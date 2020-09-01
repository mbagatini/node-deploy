import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';

export interface ICriaUsuarioDTO {
  nome: string;
  rg: string;
  cpf: string;
  data_nascimento: string;
  email: string;
  senha: string;
  endereco: string;
  bairro: string;
  numero: string;
  complemento: string;
  cep: string;
  cidade: Cidade;
}
