import { AbstractLog } from '../interfaces';

export default class implements AbstractLog {
    public prelog(logMethodName) {
        return `[${logMethodName.toUpperCase()}]`;
    }

    public postlog(logMethodName) {
        return '';
    }
}

