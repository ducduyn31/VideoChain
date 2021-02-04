import {Gateway, GatewayOptions} from 'fabric-network';
import {AuthenticationConfig, authenticationConfig, setupConnection} from './authentication';

interface ApplicationConfig {
    authenticationConfig: AuthenticationConfig,
    network: string,
    chaincode: string,
}

const config: ApplicationConfig = {
    authenticationConfig,
    network: 'mychannel',
    chaincode: 'frame',
}


async function main() {
    try {
        const {
            connectionConfigProfile: ccp,
            wallet
        } = await setupConnection(authenticationConfig.connectionProfileFile, authenticationConfig.walletPath, authenticationConfig.certificateAuthority.hostname);
        const gateway = new Gateway();
        const gatewayOpts: GatewayOptions = {
            wallet,
            identity: authenticationConfig.user.id,
            discovery: {
                enabled: true,
                asLocalhost: true,
            },
        };

        try {
            await gateway.connect(ccp, gatewayOpts);
            const network = await gateway.getNetwork(config.network);
            const contract = network.getContract(config.chaincode);
        } finally {
            gateway.disconnect();
        }

    } catch (error) {
        console.error(`***** FAILED to run the application: ${error}`)
    }
}

main();
