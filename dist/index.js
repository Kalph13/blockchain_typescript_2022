"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require("crypto-js");
class Block {
    constructor(index, hash, prevHash, data, time) {
        this.index = index;
        this.hash = hash;
        this.prevHash = prevHash;
        this.data = data;
        this.time = time;
    }
    ;
}
Block.calculateHash = (index, prevHash, data, time) => CryptoJS.SHA256(index + prevHash + data + time).toString();
Block.validateStructure = (Block) => typeof (Block.index) === "number" &&
    typeof (Block.hash) === "string" &&
    typeof (Block.prevHash) === "string" &&
    typeof (Block.data) === "string" &&
    typeof (Block.time) === "number";
;
const genesisBlock = new Block(0, Block.calculateHash(0, "", "Hello World", 20220408), "", "Genesis Block", 20220408);
let blockchain = [genesisBlock];
const getBlockChain = () => blockchain;
const getLatestBlock = () => blockchain[blockchain.length - 1];
const getNewTime = () => Math.round(new Date().getTime() / 1000);
const getHash = (compBlock) => Block.calculateHash(compBlock.index, compBlock.prevHash, compBlock.data, compBlock.time);
const createNewBlock = (data) => {
    const prevBlock = getLatestBlock();
    const nextIndex = prevBlock.index + 1;
    const nextTime = getNewTime();
    const nextHash = Block.calculateHash(nextIndex, prevBlock.hash, data, nextTime);
    const nextBlock = new Block(nextIndex, nextHash, prevBlock.hash, data, nextTime);
    addBlock(nextBlock);
    return nextBlock;
};
const addBlock = (nextBlock) => {
    if (isBlockValid(nextBlock, getLatestBlock())) {
        blockchain.push(nextBlock);
    }
};
const isBlockValid = (compBlock, prevBlock) => {
    if (!Block.validateStructure(compBlock))
        return false;
    else if (prevBlock.index + 1 !== compBlock.index)
        return false;
    else if (prevBlock.hash !== compBlock.prevHash)
        return false;
    else if (getHash(compBlock) !== compBlock.hash)
        return false;
    else
        return true;
};
console.log(getBlockChain());
console.log(createNewBlock("Second Block"));
console.log(createNewBlock("Third Block"));
//# sourceMappingURL=index.js.map