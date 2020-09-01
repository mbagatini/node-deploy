import { injectable, inject } from 'tsyringe';
import Cidade from '@modules/cidades/infra/typeorm/entities/Cidade';
import { ICidadesRepositorio } from '@modules/cidades/repositories/ICidadesRepositorio';
import { IEstadosRepositorio } from '@modules/estados/repositories/IEstadosRepositorio';
import { IRequestDTO } from '@modules/cidades/dtos/ICriaCidadeDTO';
import AppError from '@shared/errors/AppError';

@injectable()
export default class CriaCidadeService {
  constructor(
    @inject('CidadesRepositorio')
    private cidadesRepositorio: ICidadesRepositorio,

    @inject('EstadosRepositorio')
    private estadosRepositorio: IEstadosRepositorio,
  ) {}

  public async executa(dadosCidade: IRequestDTO): Promise<Cidade> {
    const { nome, uf } = dadosCidade;

    const estado = await this.estadosRepositorio.procuraPorUf(uf);

    if (!estado) throw new AppError('Estado não existe');

    const { resultados } = await this.cidadesRepositorio.procuraPorParams({
      uf,
      nome,
    });

    if (resultados > 0) {
      throw new AppError(`A cidade ${nome} já existe`);
    }

    const cidade = await this.cidadesRepositorio.cria({
      nome,
      estado,
    });

    const novaCidade = await this.cidadesRepositorio.salva(cidade);

    return novaCidade;
  }
}
