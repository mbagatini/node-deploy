import { hash, compare } from 'bcryptjs';
import IProvedorHash from '../models/IProvedorHash';

export default class BCryptProvedorHash implements IProvedorHash {
  public async geraHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async comparaHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
