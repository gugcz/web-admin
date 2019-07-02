[![Dependency Status](https://david-dm.org/gugcz/web-admin.png)](https://david-dm.org/gugcz/web-admin) 
[![devDependency Status](https://david-dm.org/gugcz/web-admin/dev-status.png)](https://david-dm.org/gugcz/web-admin#info=devDependencies)

# web-admin
Administration for GUG.cz web

## Requirements 
- [git](http://git-scm.com/downloads)
- [nodeJS](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/index.html ) - for protractor

## Installation

Download this package

```shell
git clone https://github.com/gugcz/web-admin.git
```

Install dependencies

```shell
yarn install
```

or just 

```shell
yarn
```

note: npm is also working

## Development
Run example application with live reload

```shell
npm start
```

Open [http://localhost:8000/](http://localhost:8000/)in browser and happy developing

## Other commands
```
 npm start             # vývojový režim, spustí aplikaci lokálně, dělá livereload
 
 npm test               # spuštění unit testů (karma)
 
 npm run test-watch     # opakovené spouštění unit testů při změně souborů 

 npm run protractor     # E2E testy
 
 npm build              # zbuilduje celou aplikaci do složky dist
```

## Deployment

A repository contains a configuration for Circle CI/CD. Each commit on `master` branch will deploy project to Firebase hosting. 