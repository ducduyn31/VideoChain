import * as FabricCAServices from 'fabric-ca-client';

const buildCAClient = (ccp: Record<string, any>, caHostName: string): FabricCAServices => {
    const caInfo = ccp.certificateAuthorities[caHostName];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices(caInfo.url, {
        trustedRoots: caTLSCACerts,
        verify: false,
    }, caInfo.caName);

    console.log(`Built a CA Client named ${caInfo.caName}`);
    return caClient;
}

export {
    buildCAClient,
}
