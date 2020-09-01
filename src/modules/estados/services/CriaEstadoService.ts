import { injectable, inject } from 'tsyringe';
import { IEstadosRepositorio } from '@modules/estados/repositories/IEstadosRepositorio';
import { IRequestDTO } from '@modules/estados/dtos/ICriaEstadoDTO';
import Estado from '@modules/estados/infra/typeorm/entities/Estado';
import AppError from '@shared/errors/AppError';

@injectable()
export default class CriaEstadoService {
  constructor(
    @inject('EstadosRepositorio')
    private estadosRepositorio: IEstadosRepositorio,
  ) {}

  public async executa(dadosEstado: IRequestDTO): Promise<Estado> {
    const { nome, uf } = dadosEstado;

    const ufJaExiste = await this.estadosRepositorio.procuraPorUf(uf);

    if (ufJaExiste) {
      throw new AppError(`Já existe um estado com esse uf: ${uf}`, 400);
    }

    const nomeJaExiste = await this.estadosRepositorio.procuraPorNome(nome);
    if (nomeJaExiste) {
      throw new AppError(`Já existe um estado com esse nome: ${nome}`, 400);
    }
    const estado = await this.estadosRepositorio.cria({
      nome,
      uf,
    });

    const novoEstado = await this.estadosRepositorio.salva(estado);

    return novoEstado;
  }
}
