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
      editDelegationFor: false,
      sp: 0,
      undelegateError: false,
      vests: 0,
    };
    this.props.actions.resetState = this.resetState.bind(this);
  }
  state = {
    editDelegationFor: false,
    sp: 0,
    vests: 0,
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_delegate_vesting_shares_error) {
      this.setState({
        undelegateError: nextProps.processing.account_delegate_vesting_shares_error
      })
      nextProps.actions.setDelegateVestingSharesCompleted();
    }
    if (nextProps.processing.account_delegate_vesting_shares_resolved) {
      nextProps.actions.setDelegateVestingSharesCompleted();
      this.resetState();
    }
  }
  resetState = () => {
    this.setState({
      editDelegationFor: false,
      sp: 0,
      undelegateError: false,
      vests: 0,
      [this.state.editDelegationFor]: '',
    });
  }
  handleCancel = () => {
    this.resetState();
  }
  handleOnChange = (value) => {
    const parsed = parseFloat(value)
    if (Number.isNaN(parsed)) {
      return
    }
    const vests = parsed.toFixed(6);
    const props = this.props.steem.props;
    const totalVestsSteem = parseFloat(props.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(props.total_vesting_shares.split(" ")[0])
    const sp = (totalVestsSteem * vests / totalVests).toFixed(3);
    this.setState({ vests, sp });
  }

  handleOnChangeComplete = (value) => {
    const parsed = parseFloat(value)
    if (Number.isNaN(parsed)) {
      return
    }
    const vests = parsed.toFixed(6);
    const props = this.props.steem.props;
    const totalVestsSteem = parseFloat(props.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(props.total_vesting_shares.split(" ")[0])
    const sp = (totalVestsSteem * vests / totalVests).toFixed(3);
    this.setState({ vests, sp });
  }
  handleVestingSharesRemove = (e, props) => {
    let { delegator, delegatee, id } = props.value.delegatee;
    delegatee = delegatee.toLowerCase().replace('@', '');
    const permissions = this.props.keys.permissions;
    this.setState({undelegateError: false})
    this.props.actions.useKey('setDelegateVestingShares', { delegator, delegatee, vestingShares: 0.000000 }, permissions[delegator])
  }
  handleVestingSharesEdit = (e, props) => {
    const t = this
    let { delegator, delegatee, id, vesting_shares } = props.value.delegatee;
    this.setState({
      editDelegationFor: delegator,
      [delegator]: delegatee,
    }, () => {
      this.handleOnChange(parseFloat(vesting_shares.split(" ")[0]))
    })
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
  handleOnChangeInput = (e, props) => {
    const { name, value } = props
    const globalProps = this.props.steem.props;
    const totalVestsSteem = parseFloat(globalProps.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(globalProps.total_vesting_shares.split(" ")[0])
    const parsed = parseFloat(value)
    let vests, sp
    if (Number.isNaN(parsed)) {
      this.setState({ [name]: value });
      return
    }
    if (name === 'vests') {
      const fixed = parsed.toFixed(6);
      sp = (totalVestsSteem * fixed / totalVests).toFixed(3)
      vests = value
    }
    if (name === 'sp') {
      const fixed = parsed.toFixed(3);
      sp = value
      vests = (fixed / totalVestsSteem * totalVests).toFixed(6)
    }
    this.setState({ vests, sp });
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
    let undelegateError = false;
    if (this.state.undelegateError) {
      undelegateError = (
        <Message
          error
          header='Operation Error'
          content={this.state.undelegateError}
        />
      )
    }
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
      let existingDelegation = 0
      if (this.props.account.vestingDelegations && this.props.account.vestingDelegations[name]) {
        const existingDelegations = this.props.account.vestingDelegations[name]
        existingDelegation = existingDelegations.reduce((a, b) => (b.delegatee === this.state[name]) ? a + parseFloat(b.vesting_shares.split(" ")[0]) : 0, 0)
      }
      const available = vests - delegated + existingDelegation;
      const target = parseFloat(this.state.vests)
      const delegateWarning = (target > available - 100)
      addVesting = (
        <Modal
          size="small"
          open
          header="Delegate Vests to another Account"
          onClose={this.resetState}
          content={
            <Form
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
                <Segment padded>
                  <Form.Field>
                    <label>Delegatee Account Name</label>
                    <Input
                      fluid
                      name="delegatee"
                      placeholder="Delegatee Account Name"
                      defaultValue={this.state[name]}
                      autoFocus
                      onChange={this.handleChangeVestingShares}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Steem Power</label>
                    <Input
                      fluid
                      name="sp"
                      value={this.state.sp}
                      onChange={this.handleOnChangeInput}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Vesting Shares</label>
                    <Input
                      fluid
                      name="vests"
                      value={this.state.vests}
                      onChange={this.handleOnChangeInput}
                    />
                  </Form.Field>
                </Segment>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={12}>
                      <Segment padded="very" basic>
                        <InputRange
                          maxValue={available}
                          minValue={0}
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
                  error
                  visible={delegateWarning}
                  header="Warning! Delegating too much SP."
                  content="Leaving so little SP in this account may cause it to stop functioning, meaning you may have to power up more Steem or Delegate to this account from another in order to even undo what you are about to do."
                />
                <Message
                  header="Caution! Delegation takes 7 days to revoke."
                  content="If you confirm this delegation, it will take effect immediately. When you are ready to revoke the delegation, it will take 7 days for that delegated balance to return to your account."
                />
                <Message
                  error
                  visible={(typeof account_delegate_vesting_shares_error === 'undefined') ? false : true}
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
      const delegatees = (this.props.account.vestingDelegations || {})[name];
      const delegated = account.delegated_vesting_shares;
      const hasDelegated = (delegated && delegated !== "0.000000 VESTS");
      const hasDelegatees = (delegatees && delegatees.length);
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
                          <NumericLabel params={numberFormat}>{vests}</NumericLabel>
                        </Table.Cell>
                        <Table.Cell>
                          <Button.Group>
                            <Button
                              color="blue"
                              size="small"
                              icon="pencil"
                              value={{ delegatee }}
                              onClick={this.handleVestingSharesEdit}
                            />
                            <Button
                              color="orange"
                              size="small"
                              icon="trash"
                              value={{ delegatee }}
                              onClick={this.handleVestingSharesRemove}
                            />
                          </Button.Group>
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
        {undelegateError}
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
