import * as argon2 from "argon2";

export default class PasswordUtil {
    static async hash(plainPass: string): Promise<string> {
        const hashedPass = await argon2.hash(plainPass, {
            type: argon2.argon2id,
            hashLength: 50,
            memoryCost: 2**16,
        });
        return hashedPass;
    }

    static async verify(attempt: string, realHashPass: string): Promise<boolean> {
        const verdict = await argon2.verify(realHashPass, attempt, {
            type: argon2.argon2id,
            hashLength: 50,
            memoryCost: 2**16,
        });
        return verdict;
    }
}