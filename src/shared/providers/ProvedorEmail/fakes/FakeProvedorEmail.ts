/* eslint-disable no-console */
import IEnviaEmailDTO from '../dtos/IEnviaEmailDTO';
import IProvedorEmail from '../models/IProvedorEmail';

export default class FakeProvedorEmail implements IProvedorEmail {
  private mensagens: IEnviaEmailDTO[] = [];

  public async enviaEmail(mensagem: IEnviaEmailDTO): Promise<void> {
    this.mensagens.push(mensagem);
  }
}
