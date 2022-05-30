import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import AppConfig from "../src/app_config";

class ReturnToken {
    token: string;
    expiredAt: Date;

    constructor(
        token: string,
        expiredAt: Date,
    ) {
        this.token = token;
        this.expiredAt = expiredAt;
    }
}

export default class JWTUtil {
    private static readonly AUDIENCE = 'https://api.htw-resto.test/aud';
    private static readonly ISSUER = 'https://api.htw-resto.test';
    private static get DEFAULT_EXP_SECONDS(): number {
        switch (AppConfig.ENVS) {
            case "dev":
                return 365 * 24*60*60;
            case "staging":
                return 14 * 24*60*60;
            case "prod":
                return 60*60;
        }
    }

    static async generateToken(payload: {[key: string]: any}, subject: string = 'DEFAULT_USER', expirySeconds: number = this.DEFAULT_EXP_SECONDS): Promise<ReturnToken> {
        try {
            const options: jwt.SignOptions = {
                expiresIn: expirySeconds, // Seconds count
                audience: this.AUDIENCE,
                issuer: this.ISSUER,
                algorithm: "RS256",
                subject,
            }
            const privateKey = fs.readFileSync(__dirname + `/../../keys/jwt_${AppConfig.ENVS}/private.key`);
            const token = jwt.sign(payload, privateKey, options);
            const expiredAt = new Date()
            expiredAt.setSeconds(expirySeconds, 0);

            return new ReturnToken(token, expiredAt);
        } catch (e) {
            console.log('Error in JWTUtil.generateToken:', e);
            throw e;
        }
    }

    static async verifyToken(token: string): Promise<object | string> {
        try {
            const options: jwt.VerifyOptions = {
                audience: this.AUDIENCE,
                issuer: this.ISSUER,
                algorithms: ["RS256"]
            }
            const publicKey = fs.readFileSync(__dirname + `/../../keys/jwt_${AppConfig.ENVS}/public.key`);
            const decoded = jwt.verify(token, publicKey, options);

            return decoded;
        } catch (e) {
            console.log('Error in JWTUtil.verifyToken:', e);
            throw e;
        }
    }
}
