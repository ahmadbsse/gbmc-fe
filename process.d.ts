declare namespace NodeJS {
    export interface ProcessEnv {
        JWT_SECRET: string;
        NEXT_PUBLIC_BASE_URL: string;
        NEXT_PUBLIC_API_BASE_URL: string;
        NEXT_PUBLIC_EmailJsServiceId: string;
        NEXT_PUBLIC_EmailJsTemplateId: string;
        NEXT_PUBLIC_EmailJsPublicKey: string;
    }
}
