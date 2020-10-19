import mongodb from 'mongodb';
import { MONGO_DATABASE, MONGO_URL } from '../config'
const MongoClient = mongodb.MongoClient

/**
 * Passe a chave e o valor do Asset Blockchain para mante-lo atualizado no mongodb offchain
 * Será salvo em na collection 'worldstate'
 * @param key Chave do asset, usada no putState e getState. No mongodb será o _id
 * @param value objeto completo do asset
 */
export function putAsset(key: string, value: any){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(MONGO_URL, function (err, client) {
            if (err) return reject(err)
    
            var db = client.db(MONGO_DATABASE)
            value._id = key
            db.collection('worldstate').replaceOne({_id: key}, value, { upsert: true})
                .then(()=>resolve())
                .catch((error)=>reject(error))
        })
    })
}

/**
 * Passe a chave para remover o asset do mongodb offchain
 * Será removido do 'worldstate'
 * @param key 
 */
export function deleteAsset(key: string){
    return new Promise((resolve, reject)=>{
        MongoClient.connect(MONGO_URL, function(err, client){
            if(err) return reject(err)

            var db = client.db(MONGO_DATABASE)
            
            db.collection('worldstate').deleteOne({
                _id: key
            }).then(()=>resolve())
            .catch((error)=>reject(error))
        })
    })
}

