#!/usr/bin/env node

import minimist from "minimist";
import path from "path";
import { Web3StorageClient } from "./lib/web3storage_client";


if (!process.env.WEB3STORAGE_TOKEN) {
    throw "missing WEB3STORAGE_TOKEN environment variable"
}

const argv = minimist(process.argv.slice(2));
//console.error(argv);
//process.exit(1);
const carPath = argv['_'][0];
const name = argv.name;
//console.error(wrap_directory);
if(!carPath) {
    throw "need to specify car file path"
}

(async () => {
    const client = new Web3StorageClient(process.env.WEB3STORAGE_TOKEN || '');
    await client.storeCarFileToWeb3(carPath, name || path.basename(carPath));
})();