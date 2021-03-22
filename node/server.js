'use strict';

const http = require('http');
const express = require('express');
const appmetrics = require('appmetrics');
const monitoring = appmetrics.monitor();
//const lynx = require('lynx');

//const metrics = new lynx('telegraf', 8125);

//metrics.increment('node.pageview');

monitoring.on('cpu', (cpu) => {
  const postData = `node_cpu process=${cpu.process},system=${cpu.system} ${cpu.time}`;

  const options = {
    hostname: 'telegraf',
    port: 8126,
    path: '/telegraf',
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  };

  const req = http.request(options, (res) => {
    console.log(`---`);
    console.log(`POST: ${postData}`);
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
});


// Constants
const PORT = 8081;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World (with appmetrics)');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
