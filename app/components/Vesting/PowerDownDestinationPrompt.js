// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputRange from 'react-input-range';
import { Checkbox, Divider, Message, Modal, Segment } from 'semantic-ui-react';
import { Form, Input } from 'formsy-semantic-ui-react'

import * as KeysActions from '../../actions/keys';

const defaultState = {
  target: '',
  percent: 100,
  autoVest: false,
};

class PowerDownDestinationPrompt extends Component {

  state = {
    target: '',
    percent: 100,
    autoVest: false
  }

  handleKeyUp = (e) => {
    if (this.state.decrypted && e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  handleSubmit = (e: SyntheticEvent) => {
    const account = this.props.targetAccount;
    const permissions = this.props.keys.permissions;
    const { autoVest, target, percent } = this.state;
    this.props.actions.useKey('setWithdrawVestingRoute', { account, target, percent, autoVest }, permissions[account]);
    e.preventDefault();
  }

  handleCancel = () => {
    this.state = defaultState;
  }

  handleChange = (e, props) => {
    const newState = {};
    newState[props.name] = props.checked || props.value;
    this.setState(newState);
  }

  handleCheckboxChange = (e, props) => {
    const newState = {};
    newState[props.name] = (props.checked);
    this.setState(newState);
  }

  handleSliderChange = (value) => {
    this.setState({ percent: value });
  }

  render() {
    const {
      account_set_withdraw_vesting_route_error,
      account_set_withdraw_vesting_route_pending,
      account_set_withdraw_vesting_route_resolved
    } = this.props.processing;
    return (
      <Modal
        size="small"
        open
        header="Power Down - Destination Account"
        content={
          <Form
            error={account_set_withdraw_vesting_route_error}
            loading={account_set_withdraw_vesting_route_pending}
          >
            <Segment
              padded
              basic
            >
              <Segment basic padded clearing attached="top">
                <Input
                  label="Destination Account"
                  name="target"
                  autoFocus
                  value={this.state.target}
                  onChange={this.handleChange}
                />
              </Segment>
              <Segment basic padded clearing attached>
                <p>Percentage of Power Down to this account.</p>
                <InputRange
                  label=""
                  maxValue={100}
                  minValue={0}
                  name="percent"
                  value={this.state.percent}
                  onChange={this.handleSliderChange}
                />
                <Divider hidden />
              </Segment>
              <Segment basic padded clearing attached="bottom">
                <Checkbox
                  defaultChecked={false}
                  name="autoVest"
                  onChange={this.handleCheckboxChange}
                  label="Should it automatically power up the target account?"
                />
              </Segment>
              <Message
                error
                header="Operation Error"
                content={account_set_withdraw_vesting_route_error}
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
            onClick: this.props.handleCancel,
            disabled: account_set_withdraw_vesting_route_pending
          },
          {
            key: 'yes',
            type: 'submit',
            content: 'Set Withdraw Route',
            color: 'blue',
            onClick: this.handleSubmit,
            disabled: account_set_withdraw_vesting_route_pending
          }
        ]}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    keys: state.keys
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...KeysActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PowerDownDestinationPrompt);
