
import { listenChaincodeBlock } from './controladores/controlador-listener'
import { createIdentity } from './services/blockchain'

import { 
        CA_URL,
        CA_ADMIN_USER,
        CA_ADMIN_PASSWORD,
        MSPID,
     } from './config';

async function run(){
        await createIdentity(CA_ADMIN_USER, CA_ADMIN_PASSWORD, MSPID, CA_URL)
        await listenChaincodeBlock()
}

run()
