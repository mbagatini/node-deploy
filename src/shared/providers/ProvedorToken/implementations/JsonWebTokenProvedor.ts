import { sign } from 'jsonwebtoken';
import IProvedorToken from '../models/IProvedorToken';
import { criaTokenDTO } from '../dtos/ICriarTokenDTO';

export default class JsonWebTokenProvedor implements IProvedorToken {
  public async geraToken(dados: criaTokenDTO): Promise<string> {
    const { payload, options, secretOrPrivateKey } = dados;

    const token = sign(payload || {}, secretOrPrivateKey, options);

    return token;
  }
}
