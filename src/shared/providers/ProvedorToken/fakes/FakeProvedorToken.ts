import IProvedorToken from '../models/IProvedorToken';
import { criaTokenDTO } from '../dtos/ICriarTokenDTO';

export default class FakeProvedorToken implements IProvedorToken {
  public async geraToken(dados: criaTokenDTO): Promise<string> {
    const { payload, options, secretOrPrivateKey } = dados;

    const token = JSON.stringify(
      payload + secretOrPrivateKey + options,
    ).replace(' ', '');

    return token;
  }
}
