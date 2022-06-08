const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json').CampaignFactory;
const MNEMONIC = 'paste your mnemonic here';

const provider = new HDWalletProvider(
    MNEMONIC,
    'https://rinkeby.infura.io/v3/152bdfcd5e5b470aa1fada09eac9155d'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const factoryAbi = JSON.stringify(compiledFactory.abi);

    console.log('Attempting to deploy from account', accounts[0]);
    console.log(factoryAbi);

    const result = await new web3.eth.Contract(JSON.parse(factoryAbi))
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ gas: '3000000', from: accounts[0] });

    console.log(factoryAbi);
    console.log('Contract deployed to: ', result.options.address);

    provider.engine.stop();
};

deploy();