# Build Instructions for Changelogger 1.1.1

## Environment

 * Ubuntu 21.04
 * node v14.16.1
 * npm 6.14.12
 * Tool and library versions in package.json

# Production

To build for production:

```
# install node module dependencies
npm install

# build production
npm run build:production

# build extension zip
npm run build:extension
```

The final output file will be `./web-ext-artifacts/changelogger-1.1.1.zip`.

# Development

The command `npm run build:development` will run the build in development and watch mode. It will (re)build to `./dist` on file changes.
