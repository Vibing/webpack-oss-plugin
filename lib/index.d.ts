export interface IOtions {
    oss: {
        region: string;
        endpoint: string;
        accessKeyId: string;
        accessKeySecret: string;
        bucket: string;
    };
    prefix?: string;
    onComplete?: (compilation: any) => {};
}
