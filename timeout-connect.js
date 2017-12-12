#!/usr/bin/node
var timeout=require('./index1.js');
var http=require('http');

http.createServer(function(req,res){
  res.end('start...');
  console.log(timeout);
  timeout(5000);
}).listen(8080);
