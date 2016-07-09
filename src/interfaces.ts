interface AbstractLog {
    prelog(name?: string): string;
    postlog(name?: string): string;
}

interface DefaultLogger {
    clear?(): void;
    debug?(...a: Array<any>): string;
    error?(...a: Array<any>): string;
    fatal?(...a: Array<any>): string;
    info?(...a: Array<any>): string;
    log?(...a: Array<any>): string;
    raw?(...a: Array<any>): string;
    table?(...a: Array<any>): string;
    success?(...a: Array<any>): string;
    warn?(...a: Array<any>): string;
}

interface Logger extends DefaultLogger {
    __get(): any;
    format: Object;
    setLogLevel(level: any): void;
    wrap(target: any): void;
}

export { AbstractLog, Logger };

