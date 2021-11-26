#!/usr/bin/env node

import minimist from "minimist";
import { Web3StorageClient } from "./lib/web3storage_client";


if (!process.env.WEB3STORAGE_TOKEN) {
    throw "missing WEB3STORAGE_TOKEN environment variable"
}

const argv = minimist(process.argv.slice(2));
//console.error(argv);
//process.exit(1);
const path = argv['_'][0];
const name = argv.name;
const wrap_directory = argv['wrap-directory'] === "yes";
//console.error(wrap_directory);
if(!path) {
    throw "need to specify path"
}

(async () => {
    const client = new Web3StorageClient(process.env.WEB3STORAGE_TOKEN || '');
    await client.storeLocalPath(path,name,wrap_directory);
})();