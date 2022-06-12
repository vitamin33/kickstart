import web3 from './web3';
const compiledFactory = require('../ethereum/build/CampaignFactory.json').CampaignFactory;

const stringAbi = JSON.stringify(compiledFactory.abi);
const instance = new web3.eth.Contract(
    JSON.parse(stringAbi),
    '0xCcd20F1AEE1f7747611B1919BeEE63e23ecfD451'
);

export default instance;