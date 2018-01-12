// @flow
import React, { Component } from 'react';

import PreferredNode from './global/PreferredNode'
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

        <PreferredNode {...this.props} />

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
