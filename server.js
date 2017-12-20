const express = require('express');
const parser = require('body-parser');
const crypto = require('crypto');
const blockchain = require('./blockchain');
const server = express();
const port = 3000;
const io = require('socket.io').listen(server.listen(port));
const sockets = [];
console.log('P2P Server listening on port:'+port);

io.on('connection',function(socket){
	console.log('A New node added to the blockchain network');
	socket.on('create',function(){
		sockets.push(socket);
	})
	socket.on('mine',function(data){
		socket.emit('mined',{
			'block':data.block,
			'chain':data.chain
		});
	});
	socket.on('disconnect',function(){
		console.log('A node exited the Network');
		let index = sockets.indexOf(socket);
		if(index!=-1)
  		{
  			sockets.splice(index,1);
  		}
	});
});