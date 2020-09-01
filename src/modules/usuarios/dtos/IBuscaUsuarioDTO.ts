import Usuario from '../infra/typeorm/entities/Usuario';

export interface IRequestBuscaUsuarioDTO {
  nome?: string;
  cidadeId?: number;
  cidadeNome?: string;
  uf?: string;
  paginaId?: number;
  resultadosPorPagina?: number;
}

export interface IResponseBuscaUsuarioDTO {
  usuarios: Usuario[];
  paginas: number;
  resultados: number;
}
