#!/usr/bin/env node

import { Web3StorageClient } from "./lib/web3storage_client";


if (!process.env.WEB3STORAGE_TOKEN) {
    throw "missing WEB3STORAGE_TOKEN environment variable"
}

const client = new Web3StorageClient(process.env.WEB3STORAGE_TOKEN || '');

(async () => {
for await (const item of client.list()) {
    console.log(item);
}
})();