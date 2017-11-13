// @flow
import React, { Component } from 'react';
import { Header, Segment, Table } from 'semantic-ui-react';

import AccountName from '../global/AccountName';

export default class AccountsAuths extends Component {
  render() {
    const names = this.props.keys.names;
    const accounts = names.map((name) => {
      const account = this.props.account.accounts[name];
      return (
        <Table.Row key={name}>
          <Table.Cell>
            <Header size="small">
              <AccountName name={name} />
            </Header>
          </Table.Cell>
          <Table.Cell textAlign="center">
            <Table size='small' definition>
              <Table.Body>
                {(['posting', 'active', 'owner'].map((key_type) => account[key_type].key_auths.map((auth) => {
                  return (
                    <Table.Row>
                      <Table.Cell>{key_type}</Table.Cell>
                      <Table.Cell>{auth[0]}</Table.Cell>
                      <Table.Cell>{auth[1]}</Table.Cell>
                    </Table.Row>
                  )
                })))}
              </Table.Body>
            </Table>
          </Table.Cell>
          <Table.Cell textAlign="center">
            <Table size='small' definition>
              <Table.Body>
                {(['posting', 'active', 'owner'].map((key_type) => account[key_type].account_auths.map((auth) => {
                  return (
                    <Table.Row>
                      <Table.Cell>{key_type}</Table.Cell>
                      <Table.Cell>{auth[0]}</Table.Cell>
                      <Table.Cell>{auth[1]}</Table.Cell>
                    </Table.Row>
                  )
                })))}
              </Table.Body>
            </Table>
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Segment basic padded>
        <Header>
          <Header.Subheader>
            Each account can grant authority over portions of control to external accounts. These authorities for each account are listed below.
          </Header.Subheader>
        </Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                Name
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Key Auths
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Account Auths
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
