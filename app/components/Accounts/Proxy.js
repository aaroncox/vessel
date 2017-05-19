// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Divider, Form, Header, Icon, Input, List, Message, Modal, Segment, Table } from 'semantic-ui-react';
import NumericLabel from '../../utils/NumericLabel'
import AccountName from '../global/AccountName';

export default class AccountsProxy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.actions.resetState = this.resetState.bind(this);
  }
  state = {
    editProxyFor: false
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_set_voting_proxy_resolved) {
      nextProps.actions.setVotingProxyCompleted();
      this.resetState();
    }
  }
  resetState() {
    this.setState({
      editProxyFor: false
    });
  }
  handleCancel = () => {
    this.resetState();
  }
  handleCancelProxy = (e, props) => {
    const account = props.value;
    const permissions = this.props.keys.permissions;
    this.props.actions.useKey('setVotingProxy', { account, proxy: '' }, permissions[account])
  }
  handleEditProxy = (e, props) => {
    this.setState({
      editProxyFor: props.value
    });
  }
  handleEditProxyConfirm = (e, props) => {
    const account = props.value;
    const permissions = this.props.keys.permissions;
    const proxy = this.state[account];
    this.props.actions.useKey('setVotingProxy', { account, proxy }, permissions[account])
    e.preventDefault();
  }
  handleChangeProxy = (e, props) => {
    const editing = this.state.editProxyFor;
    const newState = {};
    newState[editing] = props.value.trim();
    this.setState(newState);
  }
  render() {
    const t = this;
    let editProxy = false;
    const {
      account_set_voting_proxy_error,
      account_set_voting_proxy_pending,
      account_set_voting_proxy_resolved
    } = this.props.processing;
    if (this.state.editProxyFor) {
      editProxy = (
        <Modal
          size="small"
          open
          header="Set Account Proxy - Witness Voting"
          content={
            <Form
              error={account_set_voting_proxy_error}
              loading={account_set_voting_proxy_pending}
            >
              <Segment
                padded
                basic
              >
                <p>
                  Please enter the name of the account you wish
                  to delegate witness voting power to.
                </p>
                <Input
                  name="proxy"
                  autoFocus
                  onChange={this.handleChangeProxy}
                />
                <Message
                  error
                  header="Operation Error"
                  content={account_set_voting_proxy_error}
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
              disabled: account_set_voting_proxy_pending
            },
            {
              key: 'yes',
              type: 'submit',
              content: 'Set Proxy',
              color: 'blue',
              value: this.state.editProxyFor,
              onClick: this.handleEditProxyConfirm,
              disabled: account_set_voting_proxy_pending
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
            <NumericLabel params={numberFormat}>{shares}</NumericLabel>
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
              disabled={!hasProxy || account_set_voting_proxy_pending}
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
            Each account may proxy it's vested weight to a designated account for witness voting.
          </Header.Subheader>
        </Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                Name
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                VESTS
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Proxied
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Destination Account
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
