// @flow
import React, { Component } from 'react';
import { Divider, Header, Icon, Segment, Statistic, Table } from 'semantic-ui-react';
import _ from 'lodash';
import NumericLabel from '../../utils/NumericLabel';
import AccountName from '../global/AccountName';

export default class PendingReward extends Component {
  getBalances(data) {
    const props = this.props.steem.props;
    const totalVestsSteem = parseFloat(props.total_vesting_fund_steem.split(' ')[0])
    const totalVests = parseFloat(props.total_vesting_shares.split(' ')[0])
    const mapping = {
      SBD: ['sbd_balance'],
      SBD_SAVINGS: ['savings_sbd_balance'],
      STEEM: ['balance'],
      STEEM_SAVINGS: ['savings_balance'],
      VESTS: ['vesting_shares']
    };
    const balances = {
      SBD: 0,
      SBD_SAVINGS: 0,
      STEEM: 0,
      STEEM_SAVINGS: 0,
      VESTS: 0,
      SP: 0
    };
    if (!data) {
      return {
        SBD: <Icon name="asterisk" loading />,
        STEEM: <Icon name="asterisk" loading />,
        VESTS: <Icon name="asterisk" loading />,
        SP: <Icon name="asterisk" loading />
      };
    }
    _.forOwn(mapping, (fields: Array, assignment: string) => {
      _.forEach(fields, (field) => {
        const [value] = data[field].split(' ');
        balances[assignment] += parseFloat(value);
      });
    });
    balances.SP = totalVestsSteem * balances.VESTS / totalVests;
    return balances;
  }
  render() {
    let display = false;
    if (this.props.steem.props) {
      const accounts = this.props.account.accounts;
      const names = this.props.keys.names;
      const t = this;
      const balances = names.map((account) => {
        return (accounts && accounts[account]) ? t.getBalances(accounts[account]) : {};
      });
      const totals = {
        SBD: balances.reduce((SBD, balance) => SBD + parseFloat(balance.SBD) + parseFloat(balance.SBD_SAVINGS), 0),
        STEEM: balances.reduce((STEEM, balance) => STEEM + parseFloat(balance.STEEM) + parseFloat(balance.STEEM_SAVINGS), 0),
        VESTS: balances.reduce((VESTS, balance) => VESTS + parseFloat(balance.VESTS), 0),
        SP: balances.reduce((SP, balance) => SP + parseFloat(balance.SP), 0),
      };
      const numberFormat = {
        shortFormat: true,
        shortFormatMinValue: 1000
      };
      display = (
        <Segment basic>
          <Header>
            Total Wallet Balance
          </Header>
          <Segment>
            <Statistic.Group size="tiny" widths="four">
              <Statistic
                value={<NumericLabel params={numberFormat}>{totals.SBD}</NumericLabel>}
                label="SBD"
              />
              <Statistic
                value={<NumericLabel params={numberFormat}>{totals.STEEM}</NumericLabel>}
                label="STEEM"
              />
              <Statistic
                value={<NumericLabel params={numberFormat}>{totals.SP}</NumericLabel>}
                label="SP"
              />
              <Statistic
                value={<NumericLabel params={numberFormat}>{totals.VESTS}</NumericLabel>}
                label="VESTS"
              />
            </Statistic.Group>
          </Segment>
          <Divider />
          <Header>
            Account Balances
          </Header>
          <Table celled unstackable attached color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="right">
                  Account
                </Table.HeaderCell>
                <Table.HeaderCell colSpan={2} textAlign="right">
                  Available to Spend
                </Table.HeaderCell>
                <Table.HeaderCell colSpan={2} textAlign="right">
                  Savings Account
                </Table.HeaderCell>
                <Table.HeaderCell colSpan={2} textAlign="right">
                  Locked
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  SBD
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  STEEM
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  SBD
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  STEEM
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  SP
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  VESTS
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {names.map((account, i) => (
                <Table.Row key={account}>
                  <Table.Cell>
                    <AccountName name={account} />
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].SBD}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].STEEM}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].SBD_SAVINGS}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].STEEM_SAVINGS}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].SP}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].VESTS}</NumericLabel>
                  </Table.Cell>
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
