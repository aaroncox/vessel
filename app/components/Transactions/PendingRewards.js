// @flow
import React, { Component } from 'react';
import { Button, Table, Header, Segment } from 'semantic-ui-react';
import AccountName from '../global/AccountName';

export default class PendingReward extends Component {

  claimRewardBalance = (e, props) => {
    const accounts = this.props.account.accounts;
    const account = props.value;
    const permissions = this.props.keys.permissions;
    const reward_sbd = accounts[account].reward_sbd_balance;
    const reward_steem = accounts[account].reward_steem_balance;
    const reward_vests = accounts[account].reward_vesting_balance;
    this.props.actions.useKey('claimRewardBalance', { account, reward_sbd, reward_steem, reward_vests }, permissions[account])
  }
  render() {
    let display = false;
    const names = this.props.keys.names;
    const accounts = this.props.account.accounts;
    const pendingAccounts = names.filter((name) => (accounts && accounts[name]) ? accounts[name].reward_vesting_balance !== '0.000000 VESTS' : false);
    if (pendingAccounts.length > 0) {
      display = (
        <Segment
          secondary
          attached
          loading={this.props.processing.reward_claim}
          textAlign="center"
        >
          <Header>
            Pending Rewards
          </Header>
          <Table celled unstackable textAlign="center">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  Actions
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Account
                </Table.HeaderCell>
                <Table.HeaderCell>
                  SBD
                </Table.HeaderCell>
                <Table.HeaderCell>
                  STEEM
                </Table.HeaderCell>
                <Table.HeaderCell>
                  VESTS
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {pendingAccounts.map((account) => (
                <Table.Row key={account}>
                  <Table.Cell>
                    <Button
                      primary
                      onClick={this.claimRewardBalance}
                      value={account}
                    >
                      Claim Pending Balances
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <AccountName name={account} />
                  </Table.Cell>
                  <Table.Cell>{this.props.account.accounts[account].reward_sbd_balance.split(" ")[0]}</Table.Cell>
                  <Table.Cell>{this.props.account.accounts[account].reward_steem_balance.split(" ")[0]}</Table.Cell>
                  <Table.Cell>{this.props.account.accounts[account].reward_vesting_balance.split(" ")[0]}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      );
    }
    return display;
  }
}
