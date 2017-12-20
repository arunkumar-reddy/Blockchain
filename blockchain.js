'use strict';

class Blockchain
{
	constructor()
	{
		this.chain = [];
		this.current_transactions = [];
		this.new_block(100);
		console.log('Blockchain created');
	}
	proof_of_work(prev_proof)
	{
		let proof = 0;
		while(!valid_proof(prev_proof,proof))
		{
			proof += 1;
		}
	}
	valid_proof(prev_proof,proof)
	{
		let guess_string = '{'+prev_proof+'}{'+proof+'}';
		let guess_hash = crypto.createHash('sha256').update(guess_string).digest('hex');
		if(guess_hash[0]=='0'&&guess_hash[1]=='0'&&guess_hash[2]==0&&guess_hash[3]==0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	valid_chain(chain)
	{
		let last_block = chain[0];
		let index = 1;
		while(index<chain.length)
		{
			let block = chain[index];
			if(block['previous_hash']!=this.hash(last_block))
			{
				return false;
			}
			if(!this.valid_proof(last_block['proof'],block['proof']))
			{
				return false;
			}
			last_block = block;
			index += 1;
		}
		return true;
	}
	update_chain(chain)
	{
		if(chain.length>this.chain.length)
		{
			this.chain = chain;
			return true;
		}
		else
		{
			return false;
		}
	}
	new_block(proof)
	{
		let hash = 1;
		if(this.chain.length!=0)
		{
			let index = this.chain.length-1;
			hash = this.hash(this.chain[index]);
		}
		let block = {
			'index':this.chain.length+1,
			'timestamp':new Date(),
			'transactions':this.current_transactions,
			'proof':proof,
			'previous_hash':hash
		}
		this.current_transactions = [];
		this.chain.push(block);
		return block;
	}
	new_transaction(sender,recipient,amount)
	{
		this.current_transactions.push({
			'sender':sender,
			'recipient':recipient,
			'amount':amount
		});
		return this.chain.length+1;
	}
	hash(block)
	{
		let block_string = JSON.stringify(block);
		return crypto.createHash('sha256').update(block_string).digest('hex');
	}
	get_chain()
	{
		return this.chain;
	}
	last_block()
	{
		let index = this.chain.length-1;
		return this.chain[index];
	}
}

module.exports = Blockchain;