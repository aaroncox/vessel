// @flow
import React, { Component } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';

const defaultNodeOptions = [
  {
    key: 'wss://steemd.steemit.com',
    text: 'wss://steemd.steemit.com',
    value: 'wss://steemd.steemit.com',
  },
];

export default class Settings extends Component {

  constructor(props) {
    super(props);
    const nodeOptions = defaultNodeOptions;
    if (props.preferences && props.preferences.steemd_node) {
      nodeOptions.push({
        key: props.preferences.steemd_node,
        text: props.preferences.steemd_node,
        value: props.preferences.steemd_node
      });
    }
    this.state = {
      nodeOptions: nodeOptions
    };
  }

  handleChange = (
    e: SyntheticEvent, { name, value }: { name: string, value: string }
  ) => {
    const { setPreference } = this.props.actions;
    setPreference(name, value);
  }

  handleNodeChange = (
    e: SyntheticEvent, { name, value }: { name: string, value: string }
  ) => {
    const { setPreference } = this.props.actions;
    setPreference(name, value);
  }

  render() {
    return (
      <Segment basic padded>
        <Form>

          {/* <Header>
            Preferred Steem Node
            <Header.Subheader>
              Configure which Steem node your wallet connects to in order to broadcast transactions.
            </Header.Subheader>
          </Header>

          <Segment attached>
            <Form.Field
              control={Select}
              search
              allowAdditions
              name="steemd_node"
              value={this.props.preferences.steemd_node}
              label="Select a default node..."
              options={this.state.nodeOptions}
              onChange={this.handleNodeChange}
              placeholder="Select a default node..."
            />
          </Segment> */}

          <Header>
            Exchange Configuration
            <Header.Subheader>
              Configure the required <strong>memo</strong> for each
              individual currency and exchange.
            </Header.Subheader>
          </Header>

          <Segment attached>
            <Header size="small">
              Bittrex
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="SBD Memo"
                name="bittrex_sbd"
                value={this.props.preferences.bittrex_sbd}
                onChange={this.handleChange}
                placeholder="Enter your SBD Memo key for Bittrex"
              />
              <Form.Input
                label="STEEM Memo"
                name="bittrex_steem"
                value={this.props.preferences.bittrex_steem}
                onChange={this.handleChange}
                placeholder="Enter your SBD Memo key for Bittrex"
              />
            </Form.Group>
          </Segment>
          <Segment attached>
            <Header size="small">
              Poloniex
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="SBD Memo"
                name="poloniex_sbd"
                value={this.props.preferences.poloniex_sbd}
                onChange={this.handleChange}
                placeholder="Enter your SBD Memo key for Poloniex"
              />
              <Form.Input
                label="STEEM Memo"
                name="poloniex_steem"
                value={this.props.preferences.poloniex_steem}
                onChange={this.handleChange}
                placeholder="Enter your SBD Memo key for Poloniex"
              />
            </Form.Group>
          </Segment>

        </Form>

      </Segment>
    );
  }
}
