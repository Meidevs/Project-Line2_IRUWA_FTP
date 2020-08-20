var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');


const servers = ['http://localhost:3000', 'http://localhost:3001'];
let cur = 0;

const handler = (req, res) => {
    console.log('Request Url : ', req.url);
    const _req = request({ url: servers[cur] + req.url }).on('error', error => {
        res.status(500).send(servers[cur] + req.url);
    });
    var string = servers[cur] + req.url;
    console.log('String : ', string)

    req.pipe(_req).pipe(res);
    cur = (cur + 1) % servers.length;
};

const server = express().get('*', handler).post('*', handler);

server.listen(8080, () => {
    console.log('http://localhost:8080/ftp')
});
