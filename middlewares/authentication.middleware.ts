import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "responses/codes";
import ServerResponse from "responses/server_response";
import AccessToken from "src/accounts/entities/access_token.entity";
import { getConnection, getRepository, MoreThan } from "typeorm";
import JWTUtil from "utils/jwt_util";

class ErrorMessage {
    static readonly UNAUTHENTICATED = 'err/auth/unauthenticated';
    static readonly ILLEGAL_TOKEN = 'err/auth/illegal-token';
    static readonly SIGN_IN_REQUIRED = 'err/auth/sign-in-required';
}

@Injectable()
export default class AuthenticateUserMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) {
            res.status(HttpStatus.FORBIDDEN).json(
                ServerResponse.Error(
                    ErrorMessage.UNAUTHENTICATED,
                    'Please input a token',
                    null,
                )
            );
            return;
        }
        
        // Get token from DB
        const accessTokenRepo = getRepository(AccessToken);
        const accessTokens = await accessTokenRepo.find({token, expiredAt: MoreThan(new Date()), isValid: true});
        if (accessTokens.length === 0) {
            res.status(HttpStatus.UNAUTHORIZED).json(
                ServerResponse.Error(
                    ErrorMessage.ILLEGAL_TOKEN,
                    'Expired or illegal token used',
                    null,
                )
            );
            return;
        }
        
        const decrypt = JWTUtil.verifyToken(token);
        if (decrypt == null) {
            res.status(HttpStatus.UNAUTHORIZED).json(
                ServerResponse.Error(
                    ErrorMessage.SIGN_IN_REQUIRED,
                    'Please sign-in again',
                    null,
                )
            );
            return;
        }

        // Save user to session
        req.headers['x-account-id'] = `${accessTokens[0].account.id}`;

        next();
    }
}