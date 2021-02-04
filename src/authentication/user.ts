import * as FabricCAServices from 'fabric-ca-client';
import {Wallet} from 'fabric-network';

const registerAndEnrollUser = async (caClient: FabricCAServices, wallet: Wallet, mspOrgId: string, adminId: string, userId: string, affiliation: string): Promise<void> => {
    try {
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`An identity for the user ${userId} already exists in the wallet`);
            return;
        }

        const adminIdentity = await wallet.get(adminId);
        if (!adminIdentity) {
            console.log('An identity for the admin user does not exist in the wallet');
            console.log('Enroll the admin user before retrying');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const admin = await provider.getUserContext(adminIdentity, adminId);

        const secret = await caClient.register({
            affiliation,
            enrollmentID: userId,
            role: 'client',
        }, admin);
        const enrollment = await caClient.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret,
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: mspOrgId,
            type: 'X.509',
        };
        await wallet.put(userId, x509Identity);
        console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
    } catch (error) {
        console.error(`Failed to register user: ${error}`);
    }
}

export {
    registerAndEnrollUser,
}
