import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: number;
}

export default function verificaAutenticacao(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token não encontrado.', 401);
  }

  // desestruturação
  // 1ª posição é o 'Bearer', não será utilizada
  // 2ª posição é o token
  const [, token] = authHeader.split(' ');
  const { segredo } = authConfig.jwt;

  try {
    // faz o decode do token pelo segredo armazenado
    const decoded = verify(token, segredo);

    // extrai o id do usuário do subject do token
    const { sub } = decoded as TokenPayload;

    // define o id da propriedade usuario no request como sendo o id do token
    // dessa forma, em todas as rotas será possível acessar o user id logado
    request.usuario = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new AppError('JWT token inválido.', 401);
  }
}
