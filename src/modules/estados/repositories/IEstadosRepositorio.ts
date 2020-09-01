import Estado from '../infra/typeorm/entities/Estado';
import { ICriaEstadoDTO } from '../dtos/ICriaEstadoDTO';
import {
  IRequestBuscaEstadoDTO,
  IResponseBuscaEstadoDTO,
} from '../dtos/IBuscaEstadoDTO';

export interface IEstadosRepositorio {
  salva(estado: Estado): Promise<Estado>;
  procuraPorUf(uf: string): Promise<Estado | undefined>;
  procuraPorNome(nome: string): Promise<Estado | undefined>;
  cria(dadosEstado: ICriaEstadoDTO): Promise<Estado>;
  procuraPorParams(
    params: IRequestBuscaEstadoDTO,
  ): Promise<IResponseBuscaEstadoDTO>;
}
