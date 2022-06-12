import React, {Component} from "react";
import {Form, Message, Button, Input} from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import {Link, Router} from '../../../routes';
import Layout from '../../../components/Layout';

class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props) {
        const address = props.query.address.replaceAll(':', '');
        return { address: address };
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({
            errorMessage: '',
            loading: true
        });

        console.log(this.props.address);

        const campaign = Campaign(this.props.address);
        const { description , value, recipient } = this.state;

        console.log(this.state);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send({
                from: accounts[0],
            });
            this.setState({
                loading: false
            });
        } catch (e) {
            console.log(this.state);
            this.setState({
                errorMessage: e.message,
                loading: false
            });
        }
    };


    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <Form onSubmit={ this.onSubmit } error={!!this.state.errorMessage}>
                    <h3>Create a request:</h3>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={
                                event => {
                                    this.setState({description: event.target.value})
                                }
                            }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in ether</label>
                        <Input
                            value={this.state.value}
                            onChange={
                                event => {
                                    this.setState({value: event.target.value})
                                }
                            }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={
                                event => {
                                    this.setState({recipient: event.target.value})
                                }
                            }
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>Create</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;