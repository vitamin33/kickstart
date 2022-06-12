import web3 from './web3';
const compiledFactory = require('../ethereum/build/CampaignFactory.json').CampaignFactory;

const stringAbi = JSON.stringify(compiledFactory.abi);
const instance = new web3.eth.Contract(
    JSON.parse(stringAbi),
    '0xf29c3ce2CEE05B5025d785dd3b0e53aF0b1C8a01'
);

export default instance;