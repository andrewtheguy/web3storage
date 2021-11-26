# upload to web3.storage

```
 `npx -p @andrewtheguy/web3storage storetoweb3 path_to_upload`
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

# dev

```
npm run watch
# in another window
node dist/storetoweb3.js
```
# publish package

```
npm run build_and_publish
```
