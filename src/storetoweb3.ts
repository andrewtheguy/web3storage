#!/usr/bin/env node

import minimist from "minimist";
import { Web3StorageClient } from "./lib/web3storage_client";


if (!process.env.WEB3STORAGE_TOKEN) {
    throw "missing WEB3STORAGE_TOKEN environment variable"
}

const argv = minimist(process.argv.slice(2));

const path = argv['_'][0];

if(!path) {
    throw "need to specify path"
}

(async () => {
    const client = new Web3StorageClient(process.env.WEB3STORAGE_TOKEN || '');
    await client.storeLocalPath(path);
})();