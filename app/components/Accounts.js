// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Divider, Form, Header, Icon, List, Message, Modal, Segment, Table } from 'semantic-ui-react';
import AccountName from './global/AccountName';

export default class Accounts extends Component {
  handleRemoveKey = (e, data) => {
    this.props.actions.removeKey(data.value);
  }
  render() {
    const t = this;
    let content = false;
    const names = this.props.keys.names;
    const accounts = names.map((name) => {
      let permissions = [];
      permissions = ['posting', 'active', 'owner'].map((permission) => (
        <Table.Cell key={permission} textAlign="center">
          {(t.props.keys.permissions[name].type === permission)
            ? <Icon size='large' color='green' name='checkmark' />
            : <Icon size='large' color='red' name='cancel' />
          }
        </Table.Cell>
      ));
      return (
        <Table.Row key={name}>
          <Table.Cell>
            <AccountName name={name} />
          </Table.Cell>
          <Table.Cell textAlign="center">
            <Header size="small">
              {(this.props.keys.permissions[name].encrypted)
                ? <Icon size="large" color="green" name="checkmark" />
                : <Icon size="large" color="red" name="cancel" />
              }
            </Header>
          </Table.Cell>
          {permissions}
          <Table.Cell>
            <Button
              icon="trash"
              color="orange"
              onClick={this.handleRemoveKey}
              value={name}
            />
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Segment basic padded>
        <Header>
          <Header.Subheader>
            Each account within the wallet can have a different set of permissions and a different password encryption.
          </Header.Subheader>
        </Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={1} textAlign="center">
                Account
              </Table.HeaderCell>
              <Table.HeaderCell colSpan={1} textAlign="center">
                Wallet
              </Table.HeaderCell>
              <Table.HeaderCell colSpan={3} textAlign="center">
                Key Types
              </Table.HeaderCell>
              <Table.HeaderCell colSpan={1}>

              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                Name
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Encrypted
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Posting
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Active
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Owner
              </Table.HeaderCell>
              <Table.HeaderCell>
                Controls
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {accounts}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}
