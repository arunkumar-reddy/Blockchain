const express = require('express');
const parser = require('body-parser');
const crypto = require('crypto');
const io = require('socket.io-client');
const blockchain = require('./blockchain');
const app = express();
const port = process.argv[2];
const socket = io.connect('http://localhost:3000');

socket.on('connect',function(socket){
	console.log('Connected to the blockchain network');
});
socket.emit('create');
console.log('The Node is now a part of the blockchain');

socket.on('mined',function(data){
	if(chain.valid_chain(data.chain))
	{
		if(chain.update(data.chain))
		{
			console.log('A new block was mined and the blockchain has been updated');
		}
	}
});

chain = new blockchain();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.listen(port);
console.log('Server listening on port:'+port);

app.post('/transactions/new',function(req,res){
	let sender = req.id.sender;
	let recipient = req.id.recipient;
	let amount = req.id.amount;
	let index = chain.new_transaction(sender,recipient,amount);
	res.send('The transaction will be added to the block '+index);
});

app.get('/mine',function(req,res){
	let last_block = chain.last_block();
	let last_proof = last_block['proof'];
	let proof = chain.proof_of_work(last_proof);
	chain.new_transaction('0',user,1);
	let block = chain.new_block(proof);
	socket.emit('mine',{'block':block,'chain':chain.get_chain()});
	let response = {
		'message': 'Mined a new block!!',
		'index': block['index'],
		'transactions': block['transactions'],
		'proof': block['proof'],
		'previous_hash': block['previous_hash']
	}
	res.send(response);
});

app.get('/chain',function(req,res){
	res.send(chain.get_chain());
});