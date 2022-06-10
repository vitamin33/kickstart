import web3 from './web3';
const Campaign = require('./build/Campaign.json').Campaign;

const CampaignInstance = address => {
    return new web3.eth.Contract(
        Campaign.abi,
        address
    )
};

export default CampaignInstance;