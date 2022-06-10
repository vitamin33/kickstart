import React, {Component} from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import ContributeForm from "../../components/ContributeForm";
import web3 from "../../ethereum/web3";
import {Button, Card, Grid} from "semantic-ui-react";
import {Link} from '../../routes';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();

        console.log(summary);
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approveCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestCount,
            approveCount
        } = this.props;

        const items = [
            {
                header: manager,
                description: 'The manager created this campaign and can requests withdraw money.',
                meta: 'Address manager',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum contribution',
                description:
                    'You must contribute at least this number of Wei.',
            },
            {
                header: requestCount,
                description: 'A request tries to withdraw money from a contract. Request must be approved by approvers.',
                meta: 'Number of requests'
            },
            {
                header: approveCount,
                description: 'Number of people who has already donated to the campaign.',
                meta: 'Number of approvers'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                description: 'How much money this campaign has left to spend.',
                meta: 'Balance (ETH)'
            },
        ];

        return <Card.Group items={items}/>
    }

    render() {
        return (
            <Layout>
                <h3>Campaign details</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;