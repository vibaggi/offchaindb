/* eslint-disable */
import { getNetwork } from '../services/blockchain';
import { putAsset, deleteAsset } from '../services/mongodb';

export async function listenChaincodeBlock(){
    try {
        const network = await getNetwork()
        const channel = network.getChannel();
        const eventHub = channel.getChannelEventHubsForOrg(process.env.MSPID)[0]; //Ouve o canal de acordo com a Organização

        eventHub.connect(true);
        eventHub.registerBlockEvent(async (bloco:any) => {
            console.log(`Analisando Bloco ${bloco.header.number}`);
            let TXvalidationCodes = bloco.metadata.metadata[2]
            //Transações com código 0 são aprovadas.
            for (let i = 0; i < TXvalidationCodes.length; i++) {
                // Para cada validation Code há uma respectiva transacao
                let transactionActions = bloco.data.data[i].payload.data.actions
                let tx_id = bloco.data.data[i].payload.header.channel_header.tx_id
                console.log("TRANSACAO: ", tx_id);
                console.log("Código de Validação: ",TXvalidationCodes[i]);
                //Por enquanto considerar primeira ação apenas para resubmeter transação
                let responsePayload = transactionActions[0].payload.action.proposal_response_payload

                // Isolando as escritas
                let ns_rwset = responsePayload.extension.results.ns_rwset
                if(!Array.isArray(ns_rwset)){
                    console.error("ERROR", `Não foi possivel ler as escritas da transação ${tx_id}`);
                    continue;
                }

                for (let j = 0; j < ns_rwset.length; j++) {
                    const rwset = ns_rwset[j].rwset;
                    let writes = rwset.writes
                    // Salvar no MongoDB
                    console.log("ESCRITAS");
                    for (let z = 0; z < writes.length; z++) {
                        const asset = writes[z];
                        const key = asset.key
                        console.log(asset);
                        if(asset.is_delete){
                            //Asset está sendo deletado
                            //REMOVER DO Banco
                            deleteAsset(key)
                        }else{
                            var value = JSON.parse(asset.value)
                            putAsset(key, value).then(()=> console.info("INFO", `Asset ${key} atualizado com sucesso!`)).catch((error)=> console.error(error))
                        }
                    }
                }

            }
            
            console.log(`Fim de análise`);
        })

    } catch (err) {
        console.log("ERROR","BLOCKCHAIN-NETWORK","Falha na conexao com o canal");
        console.error(err);
    }

}


export async function syncAssets(){
    // Busca na blockchain todos os assets e os atualiza.
    // Executar de tempos em tempos para garantir que não houve nenhum perca de informação por problema no listener.

    
}

