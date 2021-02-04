import * as path from 'path';
import * as fs from 'fs';

const parseConnectionProfile = (filename: string): Record<string, any> => {
    const connectionConfigProfilePath = path.resolve(__dirname, filename);

    if (!fs.existsSync(connectionConfigProfilePath)) {
        throw new Error(`no such file or directory: ${connectionConfigProfilePath}`)
    }

    const contents = fs.readFileSync(connectionConfigProfilePath, 'utf8');
    const ccp = JSON.parse(contents);

    console.log(`Loaded the network configuration located at ${connectionConfigProfilePath}`);
    return ccp;
}

export {parseConnectionProfile};
