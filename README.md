# upload to web3.storage

```
 node index.mjs path_to_upload
```

# web3.storage sample codes

## make car file

```
cid="bafybeigdmvh2wgmryq5ovlfu4bd3yiljokhzdep7abpe4c4lrf6rukkx4m" ipfs dag export $cid > path/to/output.car
```

```
npx ipfs-car --pack path --output test.car
```

```
curl -X POST "http://127.0.0.1:5001/api/v0/dag/export?arg=cid" > file.car
```
