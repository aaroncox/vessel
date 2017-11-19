// @flow
import React, { Component } from 'react';

import { Form, Input } from 'formsy-semantic-ui-react'
import { Divider, Grid, Header, Label, Segment, Select } from 'semantic-ui-react';

export default class Settings extends Component {

   handleChange = (
    e: SyntheticEvent, { name, value }: { name: string, value: string }
  ) => {
     const { setPreference } = this.props.actions;
     setPreference(name, value);
  }

  onValidSubmit = (
   e: SyntheticEvent
 ) => {
    const { setPreference } = this.props.actions;
    setPreference('steemd_node', e.steemd_node);
 }

  render() {
    return (
      <Segment basic padded>
        <Form onValidSubmit={this.onValidSubmit}>

          <Header>
            Preferred Steem Node
            <Header.Subheader>
              Configure which Steem node your wallet connects to in order to broadcast transactions.
            </Header.Subheader>
          </Header>

          <Segment attached>
            <Grid>
              <Grid.Column width={9}>
                <Form.Input
                  label="Steem RPC Node"
                  name="steemd_node"
                  instantValidation
                  validations="isUrl"
                  validationErrors={{
                    isUrl: 'Requires a valid URL starting with http:// or https://'
                  }}
                  errorLabel={ <Label color="red" pointing /> }
                  value={this.props.preferences.steemd_node}
                />
              </Grid.Column>
              <Grid.Column width={7}>
                <Form.Button color='blue' content='Update' label={`Currently: ${this.props.preferences.steemd_node}`}/>
              </Grid.Column>
            </Grid>
          </Segment>

        </Form>

        <Divider />

        <Form>

          <Header>
            Exchange Configuration
            <Header.Subheader>
              Configure the required <strong>unencrypted memo</strong> for each
              individual currency and exchange. Do <strong>NOT</strong> add the
              <strong>#</strong> prefix for encryption, only the memo that the exchange
              specifies.
            </Header.Subheader>
          </Header>

          <Segment attached>
            <Header size="small">
              Bittrex
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="SBD Memo (Unencrypted)"
                name="bittrex_sbd"
                value={this.props.preferences.bittrex_sbd}
                onChange={this.handleChange}
                placeholder="Enter your SBD Unencrypted Memo key for Bittrex"
              />
              <Form.Input
                label="STEEM Memo (Unencrypted)"
                name="bittrex_steem"
                value={this.props.preferences.bittrex_steem}
                onChange={this.handleChange}
                placeholder="Enter your STEEM Unencrypted Memo key for Bittrex"
              />
            </Form.Group>
          </Segment>
          <Segment attached>
            <Header size="small">
              OpenLedger
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="SBD Memo (Unencrypted)"
                name="openledger_sbd"
                value={this.props.preferences.openledger_sbd}
                onChange={this.handleChange}
                placeholder="Enter your SBD Unencrypted Memo key for OpenLedger"
              />
              <Form.Input
                label="STEEM Memo (Unencrypted)"
                name="openledger_steem"
                value={this.props.preferences.openledger_steem}
                onChange={this.handleChange}
                placeholder="Enter your STEEM Unencrypted Memo key for OpenLedger"
              />
            </Form.Group>
          </Segment>
          <Segment attached>
            <Header size="small">
              Poloniex
            </Header>
            <Form.Group widths="equal">
              <Form.Input
                label="SBD Memo (Unencrypted)"
                name="poloniex_sbd"
                value={this.props.preferences.poloniex_sbd}
                onChange={this.handleChange}
                placeholder="Enter your SBD Unencrypted Memo key for Poloniex"
              />
              <Form.Input
                label="STEEM Memo (Unencrypted)"
                name="poloniex_steem"
                value={this.props.preferences.poloniex_steem}
                onChange={this.handleChange}
                placeholder="Enter your STEEM Unencrypted Memo key for Poloniex"
              />
            </Form.Group>
          </Segment>

        </Form>

      </Segment>
    );
  }
}
