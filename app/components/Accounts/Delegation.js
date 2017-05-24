// @flow
import React, { Component } from 'react';
import { Button, Divider, Form, Grid, Header, Input, Message, Modal, Segment, Table } from 'semantic-ui-react';
import InputRange from 'react-input-range';

import NumericLabel from '../../utils/NumericLabel';
import AccountName from '../global/AccountName';

export default class AccountsProxy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vests: 0,
      sp: 0,
      editDelegationFor: false
    };
    this.props.actions.resetState = this.resetState.bind(this);
  }
  state = {
    vests: 0,
    sp: 0,
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
  handleOnChange = (value) => {
    const vests = parseFloat(value).toFixed(6);
    const props = this.props.steem.props;
    const totalVestsSteem = parseFloat(props.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(props.total_vesting_shares.split(" ")[0])
    const sp = totalVestsSteem * vests / totalVests;
    this.setState({ vests, sp });
  }

  handleOnChangeComplete = (value) => {
    const vests = parseFloat(value).toFixed(6);
    const props = this.props.steem.props;
    const totalVestsSteem = parseFloat(props.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(props.total_vesting_shares.split(" ")[0])
    const sp = totalVestsSteem * vests / totalVests;
    this.setState({ vests, sp });
  }
  handleVestingSharesRemove = (e, props) => {
    const { delegator, delegatee, id } = props.value.delegatee;
    const permissions = this.props.keys.permissions;
    this.props.actions.useKey('setDelegateVestingShares', { delegator, delegatee, vestingShares: 0.000000 }, permissions[delegator])
  }
  handleSetDelegateVesting = (e, props) => {
    this.setState({
      editDelegationFor: props.value
    })
  }
  handleSetDelegateVestingConfirm = (e, props) => {
    const { vests } = this.state;
    const { permissions } = this.props.keys;
    const delegator = this.state.editDelegationFor;
    const delegatee = this.state[delegator];
    this.props.actions.useKey('setDelegateVestingShares', { delegator, delegatee, vestingShares: vests }, permissions[delegator])
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
    let addVesting = false;
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    const {
      account_delegate_vesting_shares_error,
      account_delegate_vesting_shares_pending,
      account_delegate_vesting_shares_resolved
    } = this.props.processing;
    if (this.state.editDelegationFor) {
      const name = this.state.editDelegationFor;
      const account = this.props.account.accounts[name];
      const delegated = parseFloat(account.delegated_vesting_shares.split(" ")[0]);
      const vests = parseFloat(account.vesting_shares.split(" ")[0]);
      const available = vests - delegated;
      addVesting = (
        <Modal
          size="small"
          open
          header="Delegate Vests to another Account"
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
                  Please enter the name of the target account that you wish to delegate
                  a portion of the {name} account's vested weight to.
                </p>
                <Input
                  fluid
                  name="delegatee"
                  placeholder="Delegatee Account Name"
                  autoFocus
                  onChange={this.handleChangeVestingShares}
                />
                <Divider />
                <p>
                  Use the slider to determine how much of your VESTS to delegate.
                </p>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={12}>
                      <Segment padded="very" basic>
                        <InputRange
                          maxValue={available}
                          minValue={0.000001}
                          value={this.state.vests}
                          onChange={this.handleOnChange}
                          onChangeComplete={this.handleOnChangeComplete}
                        />
                      </Segment>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <Header textAlign="center" size="large">
                        <Header.Subheader>Steem Power</Header.Subheader>
                        <NumericLabel params={numberFormat}>{this.state.sp}</NumericLabel>
                        {' SP'}
                        <Header.Subheader>
                          -<NumericLabel params={numberFormat}>{this.state.vests}</NumericLabel>
                          {' VESTS'}
                        </Header.Subheader>
                      </Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Message
                  header="Caution! Delegation takes 7 days to revoke."
                  content="If you confirm this delegation, it will take effect immediately. When you are ready to revoke the delegation, it will take 7 days for that delegated balance to return to your account."
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
              content: 'Confirm Delegation',
              color: 'blue',
              value: this.state.editDelegationFor,
              onClick: this.handleSetDelegateVestingConfirm,
              disabled: account_delegate_vesting_shares_pending
            }
          ]}
        />
      );
    }
    const names = this.props.keys.names;
    const accounts = names.map((name) => {
      const account = this.props.account.accounts[name];
      const delegatees = this.props.account.vestingDelegations[name];
      const delegated = account.delegated_vesting_shares;
      const hasDelegated = (delegated && delegated !== "0.000000 VESTS");
      const hasDelegatees = (delegatees.length);
      const delegatedAmount = parseFloat(delegated.split(" ")[0]);
      const vests = parseFloat(account.vesting_shares.split(" ")[0]);
      const available = vests - delegatedAmount;
      return (
        <Table.Row key={name}>
          <Table.Cell>
            <Header size="small">
              <AccountName name={name} />
              <Header.Subheader>
                <strong>
                  <NumericLabel params={numberFormat}>{vests}</NumericLabel>
                </strong> VESTS
              </Header.Subheader>
            </Header>
          </Table.Cell>
          <Table.Cell textAlign="center">
            <Header size="small">
              <NumericLabel params={numberFormat}>{available}</NumericLabel>
              <Header.Subheader>
                VESTS
              </Header.Subheader>
            </Header>
          </Table.Cell>
          <Table.Cell textAlign="center">
            <Header size="small">
              {(hasDelegated)
                ? (
                  <NumericLabel params={numberFormat}>{delegatedAmount}</NumericLabel>
                ) : (
                  0
                )
              }
              <Header.Subheader>
                VESTS
              </Header.Subheader>
            </Header>
          </Table.Cell>
          <Table.Cell>
            {(hasDelegatees)
              ? (
                <Table size="small">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>
                        Delegatee
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        Amount
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        Date Revokable
                      </Table.HeaderCell>
                      <Table.HeaderCell collapsing>

                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                  {delegatees.map((delegatee) => {
                    const vests = parseFloat(delegatee.vesting_shares.split(" ")[0])
                    return (
                      <Table.Row key={delegatee.id}>
                        <Table.Cell>
                          <AccountName name={delegatee.delegatee} />
                        </Table.Cell>
                        <Table.Cell>
                          <NumericLabel params={numberFormat}>{vests}</NumericLabel></Table.Cell>
                        <Table.Cell>{delegatee.min_delegation_time}</Table.Cell>
                        <Table.Cell>
                          <Button
                            color="orange"
                            size="small"
                            icon="trash"
                            value={{ delegatee }}
                            onClick={this.handleVestingSharesRemove}
                          />
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                  </Table.Body>
                </Table>
              )
              : 'No active delegations'
            }
          </Table.Cell>
          <Table.Cell>
            <Button
              icon="plus"
              color="green"
              onClick={this.handleSetDelegateVesting}
              value={name}
            />
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Segment basic padded>
        {addVesting}
        <Header>
          <Header.Subheader>
            Each account may delegate a portion of it's voting power to other accounts.
            This process takes place immediately for the target account, and may be revoked
            on the date shown. Once you revoked, the vesting amount will remain locked for
            exactly 7 days before returning to the original account.
          </Header.Subheader>
        </Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                Name
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Available
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Delegating
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Delegated
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
