import { Web3Storage } from 'web3.storage'
import { createReadStream } from 'fs'
import { CarReader } from '@ipld/car/reader'
import { CarIndexedReader } from '@ipld/car/indexed-reader'
import path from 'path';
import minimist from 'minimist';
import fs from 'fs'

import { packToStream } from 'ipfs-car/pack/stream'
import { FsBlockStore } from 'ipfs-car/blockstore/fs'
import tmp from 'tmp';

const argv = minimist(process.argv.slice(2));

async function pack(inputpath: string,outputpath: string){

    const writable = fs.createWriteStream(outputpath)
    await packToStream({
      input: inputpath,
      writable,
      blockstore: new FsBlockStore()
    })

}

function getAccessToken(): string {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return 'paste-your-token-here'

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    return process.env.WEB3STORAGE_TOKEN || '';
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() })
}


async function storeCarFileToWeb3(carpath: string,name: string) {
    let car;
    try {
        //car = await CarReader.fromIterable(inStream)
        car = await CarIndexedReader.fromFile(carpath);
        const onStoredChunk = (chunkSize: number) => console.log(`stored chunk of ${chunkSize} bytes`)


        const client = makeStorageClient()
        const cid = await client.putCar(car, { name: name,onStoredChunk })
        console.log('Stored CAR file! CID:', cid);
    }finally{
        if(car) car.close();
    }
}


async function storeLocalPath(inputpath: string) {
    let tmpobj;
    try {
        tmpobj = tmp.fileSync();
        //console.error(tmpobj.name)
        const carpath = tmpobj.name;
        await pack(inputpath,carpath);

        //const extension = path.extname(inputpath);
        //const filename = path.basename(inputpath,extension);
        const filename = path.basename(inputpath);
        await storeCarFileToWeb3(carpath,filename)
        
    }finally{
        // If we don't need the file anymore we could manually call the removeCallback
        // But that is not necessary if we didn't pass the keep option because the library
        // will clean after itself.
        if(tmpobj){
            tmpobj.removeCallback();
        }
    }
}

console.error(argv);

//storeLocalPath(argv['_'][0])