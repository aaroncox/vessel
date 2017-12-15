// @flow
import React, { Component } from 'react';
import { Button, Header, Icon, Segment, Table } from 'semantic-ui-react';
import { FormattedDate, FormattedTime } from 'react-intl';

import NumericLabel from '../utils/NumericLabel';
import CancelPowerDownPrompt from './Vesting/CancelPowerDownPrompt';
import PowerDownPrompt from './Vesting/PowerDownPrompt';
import PowerDownDestinationPrompt from './Vesting/PowerDownDestinationPrompt';
import AccountName from './global/AccountName';

export default class VestingAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.actions.resetState = this.resetState.bind(this);
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_set_withdraw_vesting_route_resolved) {
      nextProps.actions.setWithdrawVestingRouteCompleted();
      this.resetState();
    }
    if (nextProps.processing.account_vesting_withdraw_resolved) {
      nextProps.actions.withdrawVestingCompleted();
      this.resetState();
    }
  }
  resetState() {
    this.setState({
      powerDown: false,
      powerDownDestination: false,
      cancelPowerDown: false,
    });
  }
  handleRemoveKey = (e, data) => {
    this.props.actions.removeKey(data.value);
  }
  handlePowerDownPrompt = (e, props) => {
    this.setState({
      powerDown: props.value
    })
  }
  handlePowerDownDestinationRemove = (e, props) => {
    const permissions = this.props.keys.permissions;
    const account = props.value.route.from_account;
    const target = props.value.route.to_account;
    const percent = 0;
    const autoVest = false;
    this.props.actions.useKey('setWithdrawVestingRoute', { account, target, percent, autoVest }, permissions[account]);
    e.preventDefault();
  }

  handlePowerDownDestinationPrompt = (e, props) => {
    this.setState({
      powerDownDestination: props.value
    })
  }
  handlePowerDownCancelPrompt = (e, props) => {
    this.setState({
      cancelPowerDown: props.value
    })
  }
  render() {
    let powerDownPrompt = false;
    const names = this.props.keys.names;
    if (this.state && this.state.powerDownDestination) {
      powerDownPrompt = (
        <PowerDownDestinationPrompt
          handleCancel={this.props.actions.resetState}
          targetAccount={this.state.powerDownDestination}
          {...this.props}
        />
      );
    }
    if (this.state && this.state.powerDown) {
      powerDownPrompt = (
        <PowerDownPrompt
          handleCancel={this.props.actions.resetState}
          targetAccount={this.state.powerDown}
          {...this.props}
        />
      );
    }
    if (this.state && this.state.cancelPowerDown) {
      powerDownPrompt = (
        <CancelPowerDownPrompt
          handleCancel={this.props.actions.resetState}
          targetAccount={this.state.cancelPowerDown}
          {...this.props}
        />
      );
    }
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    const {
      account_set_withdraw_vesting_route_error,
      account_set_withdraw_vesting_route_pending,
      account_set_withdraw_vesting_route_resolved
    } = this.props.processing;
    const props = this.props.steem.props;
    const accounts = names.map((name) => {
      const account = this.props.account.accounts[name];
      const withdrawRoutes = (this.props.account.withdrawRoutes) ? this.props.account.withdrawRoutes[name] : false;
      const nextPowerDown = new Date(account.next_vesting_withdrawal);
      const isPoweringDown = (account.next_vesting_withdrawal != "1969-12-31T23:59:59")
      let nextPowerDownDisplay = false;
      let withdrawRoutesDisplay = false;
      let withdrawRoutesControl = (
        <Button
          fluid
          color="blue"
          size="mini"
          icon="user"
          content="Add Withdraw Account"
          value={name}
          onClick={this.handlePowerDownDestinationPrompt}
        />
      );
      if (account.withdraw_routes > 0 && withdrawRoutes) {
        let total = 0;
        withdrawRoutesDisplay = (
          <Table size="small">
            <Table.Body>
              {withdrawRoutes.map((route) => {
                total = total + route.percent;
                return (
                  <Table.Row key={route.to_account}>
                    <Table.Cell>
                      <AccountName name={route.to_account} />
                    </Table.Cell>
                    <Table.Cell>
                      {route.percent / 100}%
                    </Table.Cell>
                    <Table.Cell>
                      {(route.auto_vest) ? 'VEST' : 'STEEM'}
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <Button
                        color="orange"
                        size="small"
                        icon="trash"
                        value={{ name, route }}
                        onClick={this.handlePowerDownDestinationRemove}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        );
        // Disable addition if we've allocated 100%
        if (total >= 10000) {
          withdrawRoutesControl = false;
        }
      }
      let controls = (
        <Button
          color="green"
          size="small"
          icon="lightning"
          content="Start"
          value={name}
          onClick={this.handlePowerDownPrompt}
        />
      );
      if (isPoweringDown) {
        const rate = account.vesting_withdraw_rate;
        const vests = parseFloat(rate.split(" ")[0]);
        const totalVestsSteem = parseFloat(props.total_vesting_fund_steem.split(" ")[0])
        const totalVests = parseFloat(props.total_vesting_shares.split(" ")[0])
        const steem = totalVestsSteem * vests / totalVests;
        controls = (
          <Button
            color="orange"
            size="small"
            icon="cancel"
            content="Stop"
            value={name}
            onClick={this.handlePowerDownCancelPrompt}
          />
        );
        nextPowerDownDisplay = (
          <Header>
            +<NumericLabel params={numberFormat}>{steem}</NumericLabel> STEEM
            <Header.Subheader>
              &ndash;<NumericLabel params={numberFormat}>{vests}</NumericLabel> VESTS
              {' @ '}
              <FormattedTime
                value={nextPowerDown}
              />
              {' - '}
              <FormattedDate
                value={nextPowerDown}
                day="numeric"
                month="short"
                year="numeric"
              />
            </Header.Subheader>
          </Header>
        );
      }
      return (
        <Table.Row key={name}>
          <Table.Cell>
            <AccountName name={name} />
          </Table.Cell>
          <Table.Cell textAlign="center">
            {(isPoweringDown)
              ? (
                <Icon.Group size="large">
                  <Icon color="green" size="big" name="thin circle" />
                  <Icon color="green" name="lightning" />
                </Icon.Group>
              )
              : (
                <Icon size="small" color="red" name="circle" />
              )
            }
          </Table.Cell>
          <Table.Cell>
            {withdrawRoutesDisplay}
            {withdrawRoutesControl}
          </Table.Cell>
          <Table.Cell>
            {nextPowerDownDisplay}
          </Table.Cell>
          <Table.Cell textAlign="right">
            {controls}
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Segment
        basic
        padded
        loading={account_set_withdraw_vesting_route_pending}
        disabled={account_set_withdraw_vesting_route_pending}
        >
        {powerDownPrompt}
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Vested Account
              </Table.HeaderCell>
              <Table.HeaderCell collapsing>
                Active
              </Table.HeaderCell>
              <Table.HeaderCell>
                Destination Account(s)
              </Table.HeaderCell>
              <Table.HeaderCell>
                Incoming Funds
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="right">
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
