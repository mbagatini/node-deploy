import IEnviaEmailDTO from '../dtos/IEnviaEmailDTO';

export default interface IProvedorEmail {
  enviaEmail(dados: IEnviaEmailDTO): Promise<void>;
}
