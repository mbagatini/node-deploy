import { errors } from 'celebrate';

class Error {
  public readonly message: string;

  public readonly statusCode: number;

  // Código de status é 400 por padrão
  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default Error;
