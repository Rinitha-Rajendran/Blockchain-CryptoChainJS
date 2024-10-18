// Import the SHA256 hashing function from the crypto-js library
const SHA256 = require("crypto-js/sha256");

// Define the Block class to represent each block in the blockchain
class Block {
    // Constructor method to initialize a new block
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index;                 // Set the index of the block
        this.timestamp = timestamp;         // Set the timestamp of when the block was created
        this.data = data;                   // Set the data to be stored in the block (e.g., transactions)
        this.previousHash = previousHash;   // Set the previous block's hash (default is an empty string)
        this.hash = this.calculateHash();    // Calculate and set the hash for the current block
    }

    // Method to calculate the hash of the block
    calculateHash() {
        // Concatenate the block's properties and return the SHA256 hash as a string
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

// Define the BlockChain class to manage the entire blockchain
class BlockChain {
    // Constructor method to initialize a new blockchain
    constructor() {
        this.chain = [this.createGenesisBlock()]; // Create the genesis block and add it to the chain
    }

    // Method to create the first block in the blockchain (the genesis block)
    createGenesisBlock() {
        // Return a new block with a predetermined index, timestamp, data, and previous hash
        return new Block(0, new Date().toString(), "Genesis Block", "0");
    }

    // Method to retrieve the latest block in the blockchain
    getLatestBlock() {
        return this.chain[this.chain.length - 1]; // Return the last block in the chain
    }

    // Method to add a new block to the blockchain
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash; // Set the previous hash of the new block
        newBlock.hash = newBlock.calculateHash(); // Calculate and set the hash of the new block
        // Log the hash of the newly mined block to the console
        console.log(`Mined the block with hash: ${newBlock.hash}`);
        this.chain.push(newBlock); // Add the new block to the chain
    }

    // Method to validate the entire blockchain
    isChainValid() {
        // Loop through the blockchain starting from the second block
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]; // Get the current block
            const previousBlock = this.chain[i - 1]; // Get the previous block

            // Check if the current block's hash is valid
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false; // Return false if the hashes do not match (block is tampered)
            }

            // Check if the current block's previousHash matches the previous block's hash
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false; // Return false if the hashes do not match (chain is broken)
            }
        }
        return true; // Return true if all blocks are valid and the chain is intact
    } 
}

// Create a new instance of the BlockChain class
let myChain = new BlockChain();
// Log message indicating the addition of the first block
console.log('<<Adding 1st block>>');
// Add the first block with index 1 and some sample data
myChain.addBlock(new Block(1, "18/10/2024", { qty: 15 }));
// Log message indicating the addition of the second block
console.log('<<Adding 2nd block>>');
// Add the second block with index 2 and some sample data
myChain.addBlock(new Block(2, "18/10/2024", { qty: 25 }));

// Check if the blockchain is valid and log the result
console.log(myChain.isChainValid() ? 'The chain is valid' : 'The chain is not valid');

// Export the BlockChain and Block classes for use in other files
module.exports.BlockChain = BlockChain;
module.exports.Block = Block;
