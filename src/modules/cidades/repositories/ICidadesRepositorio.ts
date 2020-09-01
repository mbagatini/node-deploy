import Cidade from '../infra/typeorm/entities/Cidade';
import {
  IRequestBuscaCidadeDTO,
  IResponseBuscaCidadeDTO,
} from '../dtos/IBuscaCidadeDTO';
import { IRequestDTO, ICriaCidadeDTO } from '../dtos/ICriaCidadeDTO';

export interface ICidadesRepositorio {
  salva(cidade: Cidade): Promise<Cidade>;
  cria(cidade: ICriaCidadeDTO): Promise<Cidade>;
  procuraCidade(cidade: Cidade): Promise<Cidade | undefined>;
  procuraPeloId(id: number): Promise<Cidade | undefined>;
  procuraPorParams(
    params: IRequestBuscaCidadeDTO,
  ): Promise<IResponseBuscaCidadeDTO>;
}
