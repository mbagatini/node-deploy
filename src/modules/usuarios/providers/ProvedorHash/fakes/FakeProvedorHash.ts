import IProvedorHash from '../models/IProvedorHash';

export default class FakeProvedorHash implements IProvedorHash {
  public async geraHash(payload: string): Promise<string> {
    return payload;
  }

  public async comparaHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
