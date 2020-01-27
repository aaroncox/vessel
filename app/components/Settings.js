// @flow
import React, { Component } from 'react';

import PreferredNode from './global/PreferredNode'
import { Form, Input } from 'formsy-semantic-ui-react'
import { Divider, Grid, Header, Label, Segment, Select, Table, Button, Modal } from 'semantic-ui-react';

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addContactModal: false,
      newContact: '',
    }
  }

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

  handleContactChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = value.replace(/(@|\s)+/gim, ' ');
    this.setState({
      newContact: cleaned
    });
  }

  handleCancelContact = (e: SyntheticEvent) => {
    this.setState({
      addContactModal: false
    });
    e.preventDefault();
  }

  handleConfirmContact = (e: SyntheticEvent) => {
    const { newContact } = this.state;
    if (newContact !== '') this.props.actions.addContact(newContact);
    this.setState({
      addContactModal: false,
      newContact: ''
    });
    e.preventDefault();
  }

  render() {
    let modal = false;
    let contactList = this.props.account.contacts && this.props.account.contacts.map((contact) => {
      return (        
        <Table.Row key={contact} textAlign="center">
          <Table.Cell>
            {contact}
          </Table.Cell>
          <Table.Cell width={5}>
            <Button
              onClick={() => this.props.actions.removeContact(contact)}
              secondary
              >
              Remove
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    })

    if (this.state.addContactModal) {
      modal = (
        <Modal
          open
          header="Add a New Contact"
          content={
            <Segment basic padded>
              <Form>
                <Form.Field
                  control={Input}
                  name="contact"
                  label='Username to add to contact list'
                  placeholder="username (without @)"
                  autoFocus={true}
                  value={this.state.newContact}
                  onChange={this.handleContactChange}
                />
              </Form>
            </Segment>
          }
          actions={[
            {
              key: 'no',
              icon: 'cancel',
              content: 'Cancel',
              color: 'red',
              floated: 'left',
              onClick: this.handleCancelContact,
            },
            {
              key: 'yes',
              icon: 'checkmark',
              content: 'Confirmed - add contact',
              color: 'green',
              onClick: this.handleConfirmContact,
            }
          ]}
        />
      );
    }

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

        <Divider />

        <Header>
          Contact List
          <Header.Subheader>
            Add or remove users from your contact list.
          </Header.Subheader>
        </Header>

        <Segment attached>
          <Table
            definition
            collapsing
            style={{ minWidth: '300px', margin: '0 auto' }}
          >
            <Table.Body>
              {contactList}
              <Table.Row>
                <Table.Cell colSpan={2} textAlign="center">
                  <Button
                    onClick={() => this.setState({addContactModal: true})}
                    primary
                    >
                    Add New Contact
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Segment>

      {modal}
      </Segment>
    );
  }
}
