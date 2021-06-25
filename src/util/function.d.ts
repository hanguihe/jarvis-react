import ora from 'ora';
/**
 * 打印信息
 */
export declare const logger: {
    cyan: (text: string) => void;
    gray: (text: string) => void;
    success: (text: string) => ora.Ora;
    error: (text: string) => ora.Ora;
};
export declare function resolveProjectFile(filepath: string): string;
export declare function convertTime(time: number): string;
export declare function readProjectPackage(): any;
