# Off Chain DB

Este microserviço tem como objetivo manter fora da rede blockchain um banco de dados identico e sincronizado com o peer de sua organização.
O objetivo é permitir que os desenvolvedores apliquem todos os recursos para processar dados sem as limitações impostas pelo Hyperledger Fabric.

## Situação

Os peers da rede Hyperledger manter os dados disponiveis do Ledger em um couchdb de auxilio ao peer. Porém, para evitar sobrecargas, este é limitado.
O couchdb do peer não é capaz de executar alguns recursos de busca como aggregation ou criar uma view com dados já processados.

## Como funciona

Este microserviço cria um Listener de Bloco. Ou seja, toda vez que um bloco fecha na rede, o listener o captura e processa. 
Dentro do bloco extraimos os assets que foram alterados e atualizamos em um mongodb fora da rede.


<img src="/docs/imgs/arquitetura.png" width="800" title="Arquitetura">

Com um mongodb poderá executar queries complexas de forma mais eficiente e sem sobrecarregar o peer.