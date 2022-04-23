import * as CryptoJS from "crypto-js";

class Block {
    public index: number;
    public hash: string;
    public prevHash: string;
    public data: string;
    public time: number;
    constructor (index: number, hash: string, prevHash: string, data: string, time: number) {
        this.index = index;
        this.hash = hash;
        this.prevHash = prevHash;
        this.data = data;
        this.time = time
    };
    static calculateHash = (index: number, prevHash: string, data: string, time: number): string =>
        CryptoJS.SHA256(index + prevHash + data + time).toString(); 
    static validateStructure = (Block: Block): boolean => 
        typeof(Block.index) === "number" &&
        typeof(Block.hash) === "string" &&
        typeof(Block.prevHash) === "string" &&
        typeof(Block.data) === "string" &&
        typeof(Block.time) === "number";
};

const genesisBlock: Block = new Block(0, Block.calculateHash(0, "", "Hello World", 20220408), "", "Genesis Block", 20220408);

let blockchain: Block[] = [genesisBlock];

const getBlockChain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTime = (): number => Math.round(new Date().getTime() / 1000);

const getHash = (compBlock: Block): string => Block.calculateHash(compBlock.index, compBlock.prevHash, compBlock.data, compBlock.time);

const createNewBlock = (data: string): Block => {
    const prevBlock: Block = getLatestBlock();
    const nextIndex: number = prevBlock.index + 1;
    const nextTime: number = getNewTime();
    const nextHash: string = Block.calculateHash(nextIndex, prevBlock.hash, data, nextTime);
    const nextBlock: Block = new Block(nextIndex, nextHash, prevBlock.hash, data, nextTime);
    addBlock(nextBlock);
    return nextBlock;
};

const addBlock = (nextBlock: Block): void => {
    if(isBlockValid(nextBlock, getLatestBlock())) {
        blockchain.push(nextBlock);
    }
};

const isBlockValid = (compBlock: Block, prevBlock: Block): boolean => {
    if (!Block.validateStructure(compBlock)) return false;
    else if (prevBlock.index + 1 !== compBlock.index) return false;
    else if (prevBlock.hash !== compBlock.prevHash) return false;
    else if (getHash(compBlock) !== compBlock.hash) return false;
    else return true;
};

console.log(getBlockChain());
console.log(createNewBlock("Second Block"));
console.log(createNewBlock("Third Block"));

export {};