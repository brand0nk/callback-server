# Simple Callback Server
A quick, light server for when you need callbacks for CTF/pentesting

## Usage
```
cp exampleconfig.json config.json
// write your settings into config.json
yarn install
node index.js
```
Or you can use `pm2` to run it more like a service.

Browsing the base url, you should get redirected to a uuid path. This page gives you the callback url to use. Put whatever data you want in the `data` URL parameter and hit the url with a GET request.

Refresh the page to see a list of the responses, and clear them with a button.
(**Security risk** these are raw, unescaped strings so be careful)