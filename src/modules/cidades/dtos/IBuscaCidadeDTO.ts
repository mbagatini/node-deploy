import Cidade from '../infra/typeorm/entities/Cidade';

export interface IRequestBuscaCidadeDTO {
  paginaId?: number;
  resultadosPorPagina?: number;
  uf: string;
  nome?: string;
}

export interface IResponseBuscaCidadeDTO {
  cidades: Cidade[];
  paginas: number;
  resultados: number;
}
