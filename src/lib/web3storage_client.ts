import { Web3Storage } from 'web3.storage'
import { createReadStream } from 'fs'
import { CarReader } from '@ipld/car/reader'
import { CarIndexedReader } from '@ipld/car/indexed-reader'
import path2 from 'path';
import minimist from 'minimist';
import fs from 'fs'

import { packToStream } from 'ipfs-car/pack/stream'
import { FsBlockStore } from 'ipfs-car/blockstore/fs'
import tmp from 'tmp';

export class Web3StorageClient {
    //private web3storageToken: string;
    private client: Web3Storage;

    constructor (web3storageToken: string) {
        this.client = this.makeStorageClient(web3storageToken);
      }
    

    private async pack(inputpath: string,outputpath: string){

        const writable = fs.createWriteStream(outputpath)
        await packToStream({
        input: inputpath,
        writable,
        blockstore: new FsBlockStore(),
        wrapWithDirectory: false,
        })

    }


    private makeStorageClient(token: string): Web3Storage {
        return new Web3Storage({ token })
    }


    async storeCarFileToWeb3(carpath: string,name: string) {
        let car;
        try {
            //car = await CarReader.fromIterable(inStream)
            car = await CarIndexedReader.fromFile(carpath);
            const onStoredChunk = (chunkSize: number) => console.error(`stored chunk of ${chunkSize} bytes`)

            const cid = await this.client.putCar(car, { name: name,onStoredChunk })
            console.error('Stored CAR file! CID:', cid);
            console.log(cid);
        }finally{
            if(car) await car.close();
        }
    }


    async storeLocalPath(inputpath: string, name?: string) {
        let tmpobj;
        try {
            tmpobj = tmp.fileSync();
            //console.error(tmpobj.name)
            const carpath = tmpobj.name;
            await this.pack(inputpath,carpath);
            let filename;
            if(name){
                //const extension = path2.extname(inputpath);
                //const filename = path2.basename(inputpath,extension);
                filename = name;
            }else{
                filename = path2.basename(inputpath);
            }
            await this.storeCarFileToWeb3(carpath,filename);
            
        } finally {
            // If we don't need the file anymore we could manually call the removeCallback
            // But that is not necessary if we didn't pass the keep option because the library
            // will clean after itself.
            if(tmpobj){
                tmpobj.removeCallback();
            }
        }
    }

    list(opts?: { before?: string | undefined; maxResults?: number | undefined; } | undefined) {
        return this.client.list(opts)
    }

}