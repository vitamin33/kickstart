import React, {Component} from "react";
import {Form, Input, Message, Button} from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from '../routes';

class ContributeForm extends Component {
    state = {
        contributeValue: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({
            errorMessage: '',
            loading: true
        });

        const accounts = await web3.eth.getAccounts();

        try {
            const campaign = Campaign(this.props.address);
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.contributeValue, 'ether')
            });
            await Router.replaceRoute(`/campaigns/${this.props.address}`)
        } catch (e) {
            this.setState({ errorMessage: e.message});
        }

        this.setState({ loading: false });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute:</label>
                    <Input
                        label="ether"
                        labelPosition="right"
                        value={this.state.contributeValue}
                        onChange={
                            event => this.setState({contributeValue: event.target.value})
                        }
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage}/>
                <Button primary loading={this.state.loading}>
                    Contribute
                </Button>
            </Form>
        );
    }
}

export default ContributeForm;