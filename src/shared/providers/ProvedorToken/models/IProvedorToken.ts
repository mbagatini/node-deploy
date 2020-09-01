import { criaTokenDTO } from '../dtos/ICriarTokenDTO';

export default interface IProvedorToken {
  geraToken(dados: criaTokenDTO): Promise<string>;
}
