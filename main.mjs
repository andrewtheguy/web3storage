import { Web3Storage } from 'web3.storage'
import { createReadStream } from 'fs'
import { CarReader } from '@ipld/car'
import path from 'path';
import minimist from 'minimist';


const argv = minimist(process.argv.slice(2));


function getAccessToken() {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return 'paste-your-token-here'

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    return process.env.WEB3STORAGE_TOKEN
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() })
}


async function storeCarFile(filepath) {
    const inStream = createReadStream(filepath)
    const car = await CarReader.fromIterable(inStream)
    const onStoredChunk = chunkSize => console.log(`stored chunk of ${chunkSize} bytes`)

    const extension = path.extname(filepath);
    const filename = path.basename(filepath,extension);

    const client = makeStorageClient()
    const cid = await client.putCar(car, { name: filename,onStoredChunk })
    console.log('Stored CAR file! CID:', cid)
}

storeCarFile(argv['_'][0])