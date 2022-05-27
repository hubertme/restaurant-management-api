import * as path from "path";
import { INestApplication } from "@nestjs/common";

export default class AppConfig {
    static readonly ENVS: 'dev' | 'staging' | 'prod' = 'dev';
    static get isProduction(): boolean {
        return this.ENVS === 'prod';
    }
    private static app: INestApplication;

    public static init(app: INestApplication) {
        this.app = app;
        this.initDependencies();
    }

    static get envFilePath(): string {
        const envPath = path.resolve(__dirname, `../../envs/.${this.ENVS}.env`);
        return envPath;
    }

    private static initDependencies() {
        
    }
}