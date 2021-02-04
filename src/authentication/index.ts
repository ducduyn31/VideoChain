import {parseConnectionProfile} from './connectionProfile';
import {buildWallet} from './wallet';
import {adminCredential, enrollAdmin} from '../admin';
import {buildCAClient} from '../admin/caclient';
import * as path from 'path';
import {Wallet} from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';
import {registerAndEnrollUser} from './user';

interface AuthenticationConfig {
    connectionProfileFile: string,
    walletPath: string,
    certificateAuthority: {
        hostname: string,
    },
    orgMspID: string,
    user: {
        id: string,
        affiliation: string,
    },
}

interface ConnectionSetting {
    connectionConfigProfile: Record<string, any>,
    wallet: Wallet,
    caClient: FabricCAServices,
}

const config: AuthenticationConfig = {
    connectionProfileFile: 'connection-org1.json',
    walletPath: path.join(__dirname, 'wallet'),
    certificateAuthority: {
        hostname: 'ca.org1.example.com',
    },
    orgMspID: 'mspOrg1',
    user: {
        id: 'appUser',
        affiliation: 'org1.department1'
    },
}

const setupConnection = async (connectionProfile: string, walletPath: string = null, caHostName: string): Promise<ConnectionSetting> => {
    const ccp = parseConnectionProfile(connectionProfile);
    const wallet = await buildWallet(walletPath);
    const caClient = buildCAClient(ccp, caHostName);
    return {
        connectionConfigProfile: ccp,
        wallet,
        caClient,
    }
}

async function setup() {
    const {
        wallet,
        caClient
    } = await setupConnection(config.connectionProfileFile, config.walletPath, config.certificateAuthority.hostname);
    await enrollAdmin(caClient, wallet, config.orgMspID);
    await registerAndEnrollUser(caClient, wallet, config.orgMspID, adminCredential.id, config.user.id, config.user.affiliation);
}

export {
    setupConnection,
    config as authenticationConfig,
    AuthenticationConfig,
}
