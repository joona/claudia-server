# claudia-server

Run [claudia-api-builder](https://npmjs.org/claudia-api-builder) powered Lambda's locally to allow easier testing.

## Quickstart

Add `claudia-server` to your Lambda functions `devDependencies`. Add the following code to the end of lambda's main module.

```javascript
// File: api.js

// const ApiBuilder = require('claudia-api-builder');
// const api = module.exports = new ApiBuilder();

if(!module.parent) {
  require('claudia-server')(api, {
    port: 3800
  });
}
```

Run the file. 
```
$ node api.js
...
[Claudia-Server] listening on 3800
...
```

Your API should now be reachable on `http://localhost:3800/`.
