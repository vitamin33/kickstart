import web3 from './web3';
const compiledFactory = require('../ethereum/build/CampaignFactory.json').CampaignFactory;

const stringAbi = JSON.stringify(compiledFactory.abi);
const instance = new web3.eth.Contract(
    JSON.parse(stringAbi),
    '0x2411818E933DC56421c80F044f8f1EF5E3F75682'
);

export default instance;