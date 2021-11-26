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
const ON_DEATH = require('death'); //this is intentionally ugly

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
        let carpath: any;
        let OFF_DEATH;
        try {
            carpath = tmp.tmpNameSync();
            OFF_DEATH = ON_DEATH(function(signal: any, err: any) {
                try{
                    fs.unlinkSync(carpath);
                }catch(e){
                    console.error(e);
                }
                console.error('death');
                process.exit(1);
              })
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
            if(carpath){
                try{
                    fs.unlinkSync(carpath);
                }catch(e){
                    console.error(e);
                }
            }
            if(OFF_DEATH){
                console.error('off death')
                OFF_DEATH();
            }
        }
    }

    list(opts?: { before?: string | undefined; maxResults?: number | undefined; } | undefined) {
        return this.client.list(opts)
    }

}