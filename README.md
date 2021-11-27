

# upload to web3.storage

```
# requires nodejs 16 or some other ways for unhandled rejection to terminate the program properly
npx -p @andrewtheguy/web3storage storetoweb3 path_to_upload --name=filename_for_web3.storage (optional) --wrap-directory=yes or no (optional)
 
```

# upload existing car file

## make a car file

```
cid="bafybeigdmvh2wgmryq5ovlfu4bd3yiljokhzdep7abpe4c4lrf6rukkx4m" ipfs dag export $cid > path/to/output.car
```

```
npx ipfs-car --pack path --output test.car
```

```
curl -X POST "https://ipfs.io/api/v0/dag/export?arg=cid" > file.car
```

## upload the car file
```
npx -p @andrewtheguy/web3storage uploadcartoweb3 path_to_upload.car --name=filename_for_web3.storage (optional)
```

# dev

```
npm run watch
# in another window
node dist/storetoweb3.js or any command
```
# publish package

```
npm run build_and_publish
```
