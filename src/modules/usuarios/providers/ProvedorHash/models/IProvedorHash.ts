export default interface IProvedorHash {
  geraHash(payload: string): Promise<string>;
  comparaHash(payload: string, hashed: string): Promise<boolean>;
}
