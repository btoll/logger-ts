import { AbstractLog, Logger } from './interfaces';
import DateFormatter from './format/date';

let format: AbstractLog = new DateFormatter();

const logLevels = {
    RAW: 1,
    INFO: 2,
    WARN: 4,
    ERROR: 8,
    FATAL: 16,
    DEBUG: 32,
    //
    LOG: 1,
    INFO_ALL: 3, // (RAW && LOG) + INFO
    ERRORS: 12, // WARN + ERROR
    ERRORS_ALL: 28, // WARN + ERROR + FATAL
    ALL: 31 // (RAW && LOG) + INFO + WARN + ERROR + FATAL
};

// TODO
const preprocess = (methodName?: string): string => '';
const postprocess = (methodName?: string): string => '';

const aliases = {
    debug: 'info',
    fatal: 'error',
    raw: 'log',
    success: 'log'
};

// Default to logging all info and all errors except FATAL.
let logLevel = logLevels.INFO_ALL + logLevels.ERRORS;
let wrapped = console || {};

function checkLogLevel(level: string): number {
    return logLevel & logLevels[level];
}

const invoke = (methodName: string) =>
    function (...args: string[]) {
        if (!checkLogLevel(methodName.toUpperCase())) {
            return;
        }

        preprocess(methodName);

        // TODO: Better way?
        if (methodName === 'raw') {
            wrapped[aliases[methodName]].apply(wrapped, arguments);
        } else {
            // Check first if it's an alias so an actual underlying implementation is called!
            wrapped[aliases[methodName] || methodName].apply(wrapped, [format.prelog(methodName)]
                .concat(args)
                .concat([format.postlog(methodName)]));
        }

        postprocess(methodName);
    };

const logger: Logger = {
    format: format,

    /**
     * level === Number or a String.
     *
     * For those who know what they're doing, they can simply pass the bit value as a Number.
     *
     *      logger.setLogLevel(14);
     *
     * Else, it supports passing a String of one or more log level values delimited by the IFS:
     *
     *      logger.setLogLevel('ALL');
     *      logger.setLogLevel('ERRORS|INFO_ALL|DEBUG');
     *
     * The .reduce will simply add up the bit values.
     */
    setLogLevel(level) {
        // Internal Field Separator.
        const IFS = '|';

        logLevel = typeof level !== 'number' ?
            level.indexOf(IFS) > -1 ?
                level.split(IFS).reduce((acc, curr) => {
                    acc += logLevels[curr];
                    return acc;
                }, 0) :
                logLevels[level] :
            level;
    },

    //logger.setFormat = f =>
    //    format = logger.format = require(`./format/${f}`);

    //logger.setFormat = f => format = require(`./format/${f}`);
    wrap(target) {
        wrapped = target;
    },

    // Allow access to the underlying wrapped logger object.
    __get() {
        return wrapped;
    }
};

for (const methodName of Object.keys(wrapped)) {
    logger[methodName] = invoke(methodName);
}

for (const alias of Object.keys(aliases)) {
    logger[alias] = invoke(alias);
}

export { logger };

