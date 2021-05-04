import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.header('CognitoIdToken') !== undefined) {
      const jwtTokenPayload: any = decode(req.header('CognitoIdToken'));
      if (jwtTokenPayload !== null) {
        const userPool = jwtTokenPayload.iss.split('/').reverse()[0];
        if (userPool === process.env.USER_POOL) {
          next();
        } else {
          return res.status(403).send({
            title: 'Acesso negado!',
            messsage: 'Não foi possível identificar o seu token!',
          });
        }
      }
    } else {
      return res.status(401).send({
        title: 'Acesso não autorizado!',
        messsage: 'Necessário se autenticar antes de utilizar o recurso!',
      });
    }
  }
}
