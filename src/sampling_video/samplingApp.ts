import {exec} from 'child_process';
import {Logger} from '../logger';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';

class SamplingApp {

    public logger: Logger;

    constructor() {
        this.logger = new Logger('sampler');
    }

    public async checkPrerequisites(): Promise<boolean> {
        this.logger.info('===========Checking Prerequisites===========');
        return await this.cmdExists('ffmpeg') && await this.cmdExists('ffprobe');
    }

    public async sampling(source: string, output: string, fps = 10, size = '320x240', format = 'frame_%d.png', options: string[] = []) {
        try {
            this.logger.info(`Sampling [${path.basename(source)}] at ${10} frames per second`);

            if (!fs.existsSync(output)) {
                fs.mkdirSync(output);
            }

            return ffmpeg(source)
                .size(size)
                .videoFilters(`fps=${fps}/1`)
                .output(path.join(output, format)).run();
        } catch (e) {
            this.logger.error(`Sampling error: ${e.message}`);
        }
    }

    private cmdExists(command: string): Promise<boolean> {

        this.logger.info(`Checking command: ${command}`);
        const run = function (): Promise<string> {
            return new Promise((resolve, reject) => {
                exec(`which ${command}`, ((error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (stderr) {
                        reject(new Error(stderr));
                        return;
                    }

                    resolve(stdout);
                }));
            });
        }

        return run().then((stdout) => {
            if (stdout.trim().length === 0) {
                return Promise.reject(new Error(`No output for ${command}`));
            }

            const rNotFound = /^[\w\-]+ not found/g

            if (rNotFound.test(stdout)) {
                this.logger.error(`${command} not found!`);
                return Promise.resolve(false);
            }

            return Promise.resolve(true);
        }).catch((error) => {
            this.logger.error(error.message);
            return Promise.resolve(false);
        });
    }
}

export default new SamplingApp;
