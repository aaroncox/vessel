// @flow
import React, { Component } from 'react';
import { Button, Form, Header, Icon, Input, Message, Modal, Segment, Table } from 'semantic-ui-react';
import NumericLabel from '../../utils/NumericLabel';
import AccountName from '../global/AccountName';

export default class AccountsProxy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.actions.resetState = this.resetState.bind(this);
  }
  state = {
    editDelegationFor: false
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_delegate_vesting_shares_resolved) {
      nextProps.actions.setDelegateVestingSharesCompleted();
      this.resetState();
    }
  }
  resetState() {
    this.setState({
      editDelegationFor: false
    });
  }
  handleCancel = () => {
    this.resetState();
  }
  handleCancelProxy = (e, props) => {
    const account = props.value;
    const permissions = this.props.keys.permissions;
    this.props.actions.useKey('setDelegateVestingShares', { account, vesting_shares: 0 }, permissions[account])
  }
  handleEditProxy = (e, props) => {
    this.setState({
      editDelegationFor: props.value
    })
  }
  handleEditProxyConfirm = (e, props) => {
    const account = props.value;
    const permissions = this.props.keys.permissions;
    const vestingShares = this.state[account];
    this.props.actions.useKey('setDelegateVestingShares', { account, vestingShares }, permissions[account])
    e.preventDefault();
  }
  handleChangeVestingShares = (e, props) => {
    const editing = this.state.editDelegationFor;
    const newState = {};
    newState[editing] = props.value.trim();
    this.setState(newState);
  }
  render() {
    const t = this;
    let editProxy = false;
    const {
      account_delegate_vesting_shares_error,
      account_delegate_vesting_shares_pending,
      account_delegate_vesting_shares_resolved
    } = this.props.processing;
    if (this.state.editDelegationFor) {
      editProxy = (
        <Modal
          size="small"
          open
          header="Delegate Steem Power"
          content={
            <Form
              error={account_delegate_vesting_shares_error}
              loading={account_delegate_vesting_shares_pending}
            >
              <Segment
                padded
                basic
              >
                <p>
                  Please enter the name of the account you wish to delegate
                  a portion of this accounts vested weight to.
                </p>
                <Input
                  name="proxy"
                  autoFocus
                  onChange={this.handleChangeVestingShares}
                />
                <Message
                  error
                  header='Operation Error'
                  content={account_delegate_vesting_shares_error}
                />
              </Segment>
            </Form>
          }
          actions={[
            {
              key: 'no',
              content: 'Cancel Operation',
              floated: 'left',
              color: 'red',
              onClick: this.handleCancel,
              disabled: account_delegate_vesting_shares_pending
            },
            {
              key: 'yes',
              type: 'submit',
              content: 'Set Proxy',
              color: 'blue',
              value: this.state.editDelegationFor,
              onClick: this.handleEditProxyConfirm,
              disabled: account_delegate_vesting_shares_pending
            }
          ]}
        />
      );
    }
    const names = this.props.keys.names;
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    const accounts = names.map((name) => {
      const proxy = this.props.account.accounts[name].proxy;
      const hasProxy = (proxy && proxy !== "");
      const shares = this.props.account.accounts[name].vesting_shares.split(" ")[0];
      return (
        <Table.Row key={name}>
          <Table.Cell>
            <AccountName name={name} />
          </Table.Cell>
          <Table.Cell textAlign="center">
            <Header size="small">
              {(hasProxy)
                ? <Icon size="large" color="green" name="checkmark" />
                : <Icon size="large" color="red" name="cancel" />
              }
            </Header>
          </Table.Cell>
          <Table.Cell textAlign="center">
            <AccountName name={proxy} />
          </Table.Cell>
          <Table.Cell textAlign="center">
            <NumericLabel params={numberFormat}>{shares}</NumericLabel>
          </Table.Cell>
          <Table.Cell>
            <Button
              icon="edit"
              color="blue"
              onClick={this.handleEditProxy}
              value={name}
            />
            <Button
              icon="cancel"
              color="red"
              disabled={!hasProxy || account_delegate_vesting_shares_pending}
              onClick={this.handleCancelProxy}
              value={name}
            />
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Segment basic padded>
        {editProxy}
        <Header>
          <Header.Subheader>
            Each account may proxy it's own vested weight to a designated account for witness voting.
          </Header.Subheader>
        </Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                Name
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Proxied
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Destination Account
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                VESTS
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
