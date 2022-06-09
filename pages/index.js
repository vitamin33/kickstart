import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        console.log(campaigns);

        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map( address => {
            return {
                header: address,
                description: <a>View campaign</a>,
                fluid: true
            };
        });

        return <Card.Group items={ items } />
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Open campaign</h3>
                    <Button
                        floated="right" content="Create campaign" icon="add" primary labelPosition="right"
                    />
                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;