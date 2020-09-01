import Estado from '../infra/typeorm/entities/Estado';

export interface IRequestBuscaEstadoDTO {
  paginaId?: number;
  resultadosPorPagina?: number;
}

export interface IResponseBuscaEstadoDTO {
  estados: Estado[];
  paginas: number;
  resultados: number;
}
