// @flow
import React, { Component } from 'react';
import { Divider, Header, Icon, Segment, Statistic, Table } from 'semantic-ui-react';
import _ from 'lodash';
import NumericLabel from '../../utils/NumericLabel';
import AccountName from '../global/AccountName';

export default class PendingReward extends Component {
  getBalances(data) {
    const props = this.props.hive.props;
    const totalVestsHive = parseFloat(props.total_vesting_fund_steem.split(' ')[0])
    const totalVests = parseFloat(props.total_vesting_shares.split(' ')[0])
    const mapping = {
      HBD: ['sbd_balance'],
      HBD_SAVINGS: ['savings_sbd_balance'],
      HIVE: ['balance'],
      HIVE_SAVINGS: ['savings_balance'],
      VESTS: ['vesting_shares']
    };
    const balances = {
      HBD: 0,
      HBD_SAVINGS: 0,
      HIVE: 0,
      HIVE_SAVINGS: 0,
      VESTS: 0,
      HP: 0
    };
    if (!data) {
      return {
        HBD: <Icon name="asterisk" loading />,
        HIVE: <Icon name="asterisk" loading />,
        VESTS: <Icon name="asterisk" loading />,
        HP: <Icon name="asterisk" loading />
      };
    }
    _.forOwn(mapping, (fields: Array, assignment: string) => {
      _.forEach(fields, (field) => {
        const [value] = data[field].split(' ');
        balances[assignment] += parseFloat(value);
      });
    });
    balances.HP = totalVestsHive * balances.VESTS / totalVests;
    return balances;
  }
  render() {
    let display = false;
    if (this.props.hive.props) {
      const accounts = this.props.account.accounts;
      const names = this.props.keys.names;
      const t = this;
      const balances = names.map((account) => {
        return (accounts && accounts[account]) ? t.getBalances(accounts[account]) : {};
      });
      const totals = {
        HBD: balances.reduce((HBD, balance) => HBD + parseFloat(balance.HBD) + parseFloat(balance.HBD_SAVINGS), 0),
        HIVE: balances.reduce((HIVE, balance) => HIVE + parseFloat(balance.HIVE) + parseFloat(balance.HIVE_SAVINGS), 0),
        VESTS: balances.reduce((VESTS, balance) => VESTS + parseFloat(balance.VESTS), 0),
        HP: balances.reduce((HP, balance) => HP + parseFloat(balance.HP), 0),
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
              <Statistic>
                <Statistic.Label>HBD</Statistic.Label>
                <Statistic.Value>{<NumericLabel params={numberFormat}>{totals.HBD}</NumericLabel>}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>HIVE</Statistic.Label>
                <Statistic.Value>{<NumericLabel params={numberFormat}>{totals.HIVE}</NumericLabel>}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>HP</Statistic.Label>
                <Statistic.Value>{<NumericLabel params={numberFormat}>{totals.HP}</NumericLabel>}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>VESTS</Statistic.Label>
                <Statistic.Value>{<NumericLabel params={numberFormat}>{totals.VESTS}</NumericLabel>}</Statistic.Value>
              </Statistic>
            </Statistic.Group>
          </Segment>
          <Divider />
          <Header>
            Account Balances
          </Header>
          <Table celled unstackable attached color="grey">
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
                  HBD
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  HIVE
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  HBD
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  HIVE
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  HP
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
                    <NumericLabel params={numberFormat}>{balances[i].HBD}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].HIVE}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].HBD_SAVINGS}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].HIVE_SAVINGS}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].HP}</NumericLabel>
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
