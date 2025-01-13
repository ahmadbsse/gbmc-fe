declare namespace NodeJS {
    export interface ProcessEnv {
        JWT_SECRET: string;
        ADMIN_EMAIL: string;
        ADMIN_PASSWORD: string;
        NEXT_PUBLIC_BASE_URL: string;
    }
}
