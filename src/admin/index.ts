import * as FabricCAServices from 'fabric-ca-client';
import {Wallet} from 'fabric-network';

const adminCredential = {
    id: 'admin',
    password: 'adminpw',
}

const enrollAdmin = async (caClient: FabricCAServices, wallet: Wallet, orgMspId: string): Promise<void> => {
    try {
        const identity = await wallet.get(adminCredential.id);
        if (identity) {
            console.log(`An identity for the admin user already exists in the wallet`);
            return;
        }

        const enrollment = await caClient.enroll({
            enrollmentID: adminCredential.id,
            enrollmentSecret: adminCredential.password,
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: orgMspId,
            type: 'X.509',
        };
        await wallet.put(adminCredential.id, x509Identity);
        console.log('Successfully enrolled admin user and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to enroll admin user: ${error}`);
    }
}

export {
    enrollAdmin,
    adminCredential,
}
