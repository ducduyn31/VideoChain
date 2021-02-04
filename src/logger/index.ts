import * as path from 'path';
import * as fs from 'fs';

export class Logger {
    public baseDir: string;
    public fileName: string;
    public linePrefix: string;

    public today: Date = new Date();

    constructor(prefix: string, baseDir?: string) {
        let _dateString = `${this.today.getFullYear()}-${(this.today.getMonth() + 1)}-${this.today.getDate()}`;
        let _timeString = `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`;

        this.baseDir = baseDir || path.join(__dirname, '../../.logs/');

        this.fileName = `${prefix}-${_dateString}.log`;
        this.linePrefix = `[${_dateString} ${_timeString}]`;
    }

    public info (_string: string): void {
        this.addLog('INFO', _string);
    }

    public warn (_string: string): void {
        this.addLog('WARN', _string);
    }

    public error (_string: string): void {
        console.log('\x1b[31m%s\x1b[0m', '[ERROR] :: ' + _string.split(/r?\n/)[0]);

        this.addLog('ERROR', _string);
    }

    public custom (_filename: string, _string: string): void {
        this.addLog(_filename, _string);
    }

    private addLog (_kind: string, _string: string): void {
        const _that = this;
        _kind = _kind.toUpperCase();

        fs.open(`${_that.baseDir}${_that.fileName}`, 'a', (_err, _fileDescriptor) => {
            if (!_err && _fileDescriptor) {
                // Append to file and close it
                fs.appendFile(_fileDescriptor, `${_that.linePrefix} [${_kind}] ${_string}\n`, (_err) => {
                    if (! _err) {
                        fs.close(_fileDescriptor, (_err) => {
                            if (! _err) {
                                return true;
                            } else {
                                return console.log('\x1b[31m%s\x1b[0m', 'Error closing log file that was being appended');
                            }
                        });
                    } else {
                        return console.log('\x1b[31m%s\x1b[0m', 'Error appending to the log file');
                    }
                });
            } else {
                return console.log('\x1b[31m%s\x1b[0m', 'Error cloudn\'t open the log file for appending');
            }
        });
    }

    /**
     * Deletes the log files older than 'X' days
     *
     * Note: 'X' is defined in .env file
     */
    public clean (): void {
        //
    }
}
