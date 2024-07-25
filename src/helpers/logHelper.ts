import { createWriteStream } from "node:fs";
import type { CardboardClient } from "..";

export class Logger {
    constructor(protected readonly cardboard: CardboardClient) {
        this.loggingType = cardboard.options?.output || "error";
        if (cardboard.options?.logFile) {
            this.writeStream = createWriteStream(cardboard.options.logFile, {
                flags: "a",
            });
        } else {
            this.writeStream = {
                write: () => {
                    return null;
                },
            };
        }
    }

    loggingType;
    writeStream;
    /**
     * Send a verbosity-level message to the log. In terms of importance, this is just Cardboard rambling, at this point.
     * @param message the string you'd like to display to the log.
     */
    verbose(message: string): void {
        const time = new Date(Date.now()).toLocaleString();
        if (this.loggingType === "verbose") {
            process.stdout.write(
                `\x1b[90m[VER] [${time}] ${message}\x1b[0m\r\n`,
            );
            this.writeStream.write(`[VER] [${time}] ${message}\r\n`);
        }
    }

    /**
     * Send a debug message to the log. In terms of importance, these are "the patient is explaining its job."
     * @param message the string you'd like to display to the log.
     */
    debug(message: string): void {
        const time = new Date(Date.now()).toLocaleString();
        if (["verbose", "debug"].includes(this.loggingType)) {
            process.stdout.write(
                `\x1b[90m[DBG] [${time}] ${message}\x1b[0m\r\n`,
            );
            this.writeStream.write(`[DBG] [${time}] ${message}\r\n`);
        }
    }

    /**
     * Send a regular log. In terms of importance, these are "the patient is having a conversation."
     * @param message the string you'd like to display to the log.
     */
    log(message: string): void {
        const time = new Date(Date.now()).toLocaleString();
        if (["log", "verbose", "debug"].includes(this.loggingType)) {
            process.stdout.write(`[log] [${time}] ${message}\r\n`);
        }
        this.writeStream.write(`[log] [${time}] ${message}\r\n`);
    }

    /**
     * Send a warning to the log. In terms of importance, these are "the patient is uncomfortable."
     * @param message
     */
    warn(message: string): void {
        const time = new Date(Date.now()).toLocaleString();
        if (["warn", "log", "verbose", "debug"].includes(this.loggingType)) {
            process.stdout.write(
                `\x1b[33m[wrn] [${time}] ${message}\x1b[0m\r\n`,
            );
            this.writeStream.write(`[wrn] [${time}] ${message}\r\n`);
        }
    }
    /**
     * Sends an error to the log. In terms of importance, these are "the patient is in a lot of pain."
     * @param message the string you'd like to display.
     */
    error(message: string): void {
        const time = new Date(Date.now()).toLocaleString();
        if (
            ["warn", "error", "log", "verbose", "debug"].includes(
                this.loggingType,
            )
        ) {
            process.stdout.write(
                `\x1b[31m[err] [${time}] ${message}\x1b[0m\r\n`,
            );
            this.writeStream.write(`[err] [${time}] ${message}\r\n`);
        }
    }
    /**
     * Send a critical message. In terms of importance, these are "the patient is currently dying".
     * Will always appear print to stdout. will be highlighted in the logfile. Use this command sparingly.
     * @param message the string you'd like to display.
     */
    crit(message: string): void {
        const time = new Date(Date.now()).toLocaleString();
        process.stdout.write(
            `\x1b[1m\x1b[30m\x1b[41m[CRT] [${time}] ${message}\x1b[0m\r\n`,
        );
        this.writeStream.write(
            `${"=".repeat(`[CRT] [${time}] ${message}`.length)}
[CRT] [${time}] ${message}
${"=".repeat(`[CRT] [${time}] ${message}`.length)}\r\n`,
        );
    }
}
