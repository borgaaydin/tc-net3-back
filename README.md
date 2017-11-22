# tc-net3 - absence manager

[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://travis-ci.org/pkuhner/tc-net3-back)
[![David](https://img.shields.io/david/expressjs/express.svg)](https://david-dm.org/pkuhner/tc-net3-back)


## Install
`yarn install`
or
`npm install`

## Start
### Make sure to run mongodb before use

Using docker, run:

```
docker run --name mongo-front -p 27017:27017 mongo
```

#### This will start a server on port 4000
`node app.js`

## Deploying using docker

### MongoDB container

```
docker run --name tc-net3-mongo -p 27017:27017 mongo
```

### Back-end container

`MONGO_HOST` and `link` parameter must match the name of the MongoDB container.

```
docker run -it --name tc-net3-back -p 4000:4000 -e TC_NET2_USER=<USERNAME> -e TC_NET2_PASSWORD=<PASSWORD> -e MONGO_HOST=tc-net3-mongo --link tc-net3-mongo pkuhner/tc-net3-back
```
