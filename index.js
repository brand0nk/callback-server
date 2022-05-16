const httpServer = require('http').createServer();

const express = require('express');
const ws = require('express-ws');
const crypto = require('crypto');

const config = require('./config.json');
const { __esModule } = require('express-ws/lib');

const app = express();
const port = 9898;

const logs = [];

app.get('/', (req, res) => {
    try {
        var uuid = crypto.randomUUID();
        res.redirect(`/li/${uuid}`);
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
});

app.get('/li/:uuid', (req, res) => {
    try{
        var uuid = req.params.uuid;
        var targetUrl = `http://${config.hostname}/cb/${uuid}?data=`;
        var clearUrl = `http://${config.hostname}/li/${uuid}/clear`;
        var dataLines = '';
        if(!!logs[uuid]) {
            logs[uuid].forEach(log => {
                dataLines += (`<li>${log}</li>`);
            });
        }
        res.send(`
        <html>
        <body>
            <h1>Callback listener ${uuid}</h1>
            <p>Use this callback url <a href=${targetUrl}>${targetUrl}</a>. Attach your data in the ?data parameter.</p>
            <form action=${clearUrl} method="post">
                <button>Clear</button>
            </form>
            <hr />
            <ul>
                ${dataLines}
            </ul>
        </body>
        </html>
        `);
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
});

app.post('/li/:uuid/clear', (req, res) => {
    const uuid = req.params.uuid;
    if(!!logs[uuid]) {
        logs[uuid] = [];
    }
    res.redirect(`/li/${uuid}`);
});

app.get('/cb/:uuid/', (req, res) => {
    console.log('hit callback endpoint');
    console.log(req.params.uuid);
    console.log(req.query);
    if(!!req.query.data) {
        const uuid = req.params.uuid;
        var arr = logs[uuid];
        if(!arr) {
            arr = [];
        }
        arr.push(req.query.data);
        logs[uuid] = arr;
    }
    res.status(200).send('done');
});

// websocket endpoint
// Whatever is requested in the url, send as a payload to the socket

app.listen(port, () => {
    console.log(`Callback Server started on ${port}`);
});