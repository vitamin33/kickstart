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
    });
    it('marks caller as manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager, accounts[0]);
    });
    it('make contribution and check approver', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '1000000'
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor)
    });
    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '5'
            });
            assert(false);
        } catch (e) {
            assert(e);
        }
    });
    it('allows a manager to make request', async () => {
        await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const requestDescription = await campaign.methods.getRequestDescription(0).call();

        assert.strictEqual('Buy batteries', requestDescription);
    });
    it('processes requests', async () => {
        await campaign.methods.contribute().send({
           from: accounts[0],
           value: web3.utils.toWei('10', 'ether')
        });
        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > 104)
    });
    it('not contributor failed to approve request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });
        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        try {
            await campaign.methods.approveRequest(0).send({
                from: accounts[1],
                gas: '1000000'
            });
            assert(false);
        } catch (e) {
            assert(e);
        }
    });
});
