const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json').CampaignFactory;
const compiledCampaign = require('../ethereum/build/Campaign.json').Campaign;

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    const factoryAbi = JSON.stringify(compiledFactory.abi);
    const campaignAbi = JSON.stringify(compiledCampaign.abi);

    factory = await new web3.eth.Contract(JSON.parse(factoryAbi))
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({
            from: accounts[0],
            gas: '3000000'
        });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '3000000'
    })

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];
    campaign = await new web3.eth.Contract(
        JSON.parse(campaignAbi),
        campaignAddress
    );
});

describe('Campaigns',() => {
    it('deploys a factory and campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })
});
