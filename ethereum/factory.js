import web3 from './web3';
const compiledFactory = require('../ethereum/build/CampaignFactory.json').CampaignFactory;

const stringAbi = JSON.stringify(compiledFactory.abi);
const instance = new web3.eth.Contract(
    JSON.parse(stringAbi),
    '0x3800740F6D3385cce618cC7C879A279E5D636460'
);

export default instance;