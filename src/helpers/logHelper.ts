import { type WriteStream, createWriteStream } from "node:fs"; // How do I turn this dynamic?

const logger = (
    message: string,
    type: string,
    writeLog: WriteStream | { write: () => null },
): void => {
    let prefixConsoleMessage = "";
    const time = new Date().toLocaleString();

    switch (type) {
        case "verbose":
            prefixConsoleMessage = "\x1b[90m";
            break;
        case "debug":
            prefixConsoleMessage = "\x1b[90m";
            break;
        case "warn":
            prefixConsoleMessage = "\x1b[33m";
            break;
        case "error":
            prefixConsoleMessage = "\x1b[31m";
            break;
        case "critical":
            prefixConsoleMessage = "\x1b[1m\x1b[30m\x1b[41m";
            break;
    }
    process.stdout.write(
        `${prefixConsoleMessage}[${type.toUpperCase()}] [${time}] ${message}\x1b[0m\r\n`,
    );
    writeLog.write(`[${type.toUpperCase()}] [${time}] ${message}\r\n`);
};

/**
 * Cardboard's very own logger. Formatting & LogToFile support included!
 */
export class Logger {
    constructor(
        /**
         * The logging type - a.k.a how chatty you'll let Cardboard be.
         */
        protected readonly loggingType:
            | "verbose"
            | "debug"
            | "log"
            | "warn"
            | "error"
            | "crit" = "log",
        /**
         * a path to a log file.
         */
        protected readonly logFile?: string,
    ) {
        if (logFile) {
            this.writeStream = createWriteStream(logFile, {
                flags: "a",
            });
        } else {
            this.writeStream = {
                /**
                 * An internal dumper, just incase a write log is not given.
                 * @internal
                 */
                write: () => {
                    return null;
                },
            };
        }
    }
    /**
     * a writestream. Either an fs writestream, or a dummy to ingest content.
     */
    writeStream;
    /**
     * Send a verbosity-level message to the log. In terms of importance, this is just Cardboard rambling, at this point.
     * @param message the string you'd like to display to the log.
     */
    verbose(message: string): void {
        if (this.loggingType === "verbose") {
            logger(message, "verbose", this.writeStream);
        }
    }

    /**
     * Send a debug message to the log. In terms of importance, these are "the patient is explaining its job."
     * @param message the string you'd like to display to the log.
     */
    debug(message: string): void {
        if (["verbose", "debug"].includes(this.loggingType)) {
            logger(message, "debug", this.writeStream);
        }
    }

    /**
     * Send a regular log. In terms of importance, these are "the patient is having a conversation."
     * @param message the string you'd like to display to the log.
     */
    log(message: string): void {
        if (["log", "verbose", "debug"].includes(this.loggingType)) {
            logger(message, "log", this.writeStream);
        }
    }

    /**
     * Send a warning to the log. In terms of importance, these are "the patient is uncomfortable."
     * @param message
     */
    warn(message: string): void {
        if (["warn", "log", "verbose", "debug"].includes(this.loggingType)) {
            logger(message, "warn", this.writeStream);
        }
    }
    /**
     * Sends an error to the log. In terms of importance, these are "the patient is in a lot of pain."
     * @param message the string you'd like to display.
     */
    error(message: string): void {
        if (
            ["error", "warn", "log", "verbose", "debug"].includes(
                this.loggingType,
            )
        ) {
            logger(message, "error", this.writeStream);
        }
    }
    /**
     * Send a critical message. In terms of importance, these are "the patient is currently dying".
     * Will always appear print to stdout. will be highlighted in the log file. Use this command sparingly.
     * @param message the string you'd like to display.
     */
    crit(message: string): void {
        logger(message, "crit", this.writeStream);
    }
}
