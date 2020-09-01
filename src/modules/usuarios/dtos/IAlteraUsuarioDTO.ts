import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';

export interface IAlteraUsuarioDTO {
  id: number;
  endereco?: string;
  bairro?: string;
  numero?: string;
  complemento?: string;
  cep?: string;
  cpf?: string;
  data_nascimento?: string;
  nome?: string;
  rg?: string;
  senha?: string;
  senha_antiga?: string;
  cidade?: Cidade;
}
