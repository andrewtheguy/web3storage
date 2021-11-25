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
    private web3storageToken: string;

    constructor (web3storageToken: string) {
        this.web3storageToken = web3storageToken;
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

    private getAccessToken(): string {
        // If you're just testing, you can paste in a token
        // and uncomment the following line:
        // return 'paste-your-token-here'

        // In a real app, it's better to read an access token from an
        // environement variable or other configuration that's kept outside of
        // your code base. For this to work, you need to set the
        // WEB3STORAGE_TOKEN environment variable before you run your code.
        return process.env.WEB3STORAGE_TOKEN || '';
    }

    private makeStorageClient() {
        return new Web3Storage({ token: this.getAccessToken() })
    }


    async storeCarFileToWeb3(carpath: string,name: string) {
        let car;
        try {
            //car = await CarReader.fromIterable(inStream)
            car = await CarIndexedReader.fromFile(carpath);
            const onStoredChunk = (chunkSize: number) => console.error(`stored chunk of ${chunkSize} bytes`)


            const client = this.makeStorageClient();
            const cid = await client.putCar(car, { name: name,onStoredChunk })
            console.error('Stored CAR file! CID:', cid);
            console.log(cid);
        }finally{
            if(car) await car.close();
        }
    }


    async storeLocalPath(inputpath: string) {
        let tmpobj;
        try {
            tmpobj = tmp.fileSync();
            //console.error(tmpobj.name)
            const carpath = tmpobj.name;
            await this.pack(inputpath,carpath);

            //const extension = path2.extname(inputpath);
            //const filename = path2.basename(inputpath,extension);
            const filename = path2.basename(inputpath);
            await this.storeCarFileToWeb3(carpath,filename)
            
        } finally {
            // If we don't need the file anymore we could manually call the removeCallback
            // But that is not necessary if we didn't pass the keep option because the library
            // will clean after itself.
            if(tmpobj){
                tmpobj.removeCallback();
            }
        }
    }

}