interface tokenOptions {
  expiresIn: string;
  subject: string;
}

export interface criaTokenDTO {
  payload?: string | Record<string, unknown>;
  secretOrPrivateKey: string;
  options: tokenOptions;
}
