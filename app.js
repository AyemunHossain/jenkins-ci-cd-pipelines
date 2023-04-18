const express = require('express')
const cluster = require("cluster");
const app = express()
const os = require("os");
const cpus = os.cpus().length;
const port = 3000
const totalCPUs = require('node:os').cpus().length;
const process = require('node:process');


if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });

} else {
  runServer();
}

function runServer(){
  app.get('/', (req, res) => {
    res.send('This is a response from jenkins ci/cd server, automated push....2')
  })

  app.get('/api/slow', function (req, res) {
    console.time('slowApi');
    const baseNumber = 7;
    let result = 0;    
    for (let i = Math.pow(baseNumber, 7); i >= 0; i--) {        
      result += Math.atan(i) * Math.tan(i);
    };
    console.timeEnd('slowApi');

    console.log(`Result number is ${result} - on process ${process.pid}`);
    res.send(`Result number is ${result}`);
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
}