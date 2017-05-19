// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Message, Modal, Segment } from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react'

import * as KeysActions from '../../actions/keys';

class CancelPowerDownPrompt extends Component {

  handleConfirm = (e: SyntheticEvent) => {
    const account = this.props.targetAccount;
    const permissions = this.props.keys.permissions;
    // console.log('cancelWithdrawVesting', { account }, permissions[account]);
    this.props.actions.useKey('cancelWithdrawVesting', { account }, permissions[account]);
    e.preventDefault();
  }

  handleOnChange = (value) => {
    const vests = parseFloat(value).toFixed(6);
    const props = this.props.steem.props;
    const totalVestsSteem = parseFloat(props.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(props.total_vesting_shares.split(" ")[0])
    const sp = totalVestsSteem * vests / totalVests;
    const perWeek = Math.round(sp / 13 * 1000) / 1000;
    this.setState({ vests, sp, perWeek });
  }

  handleOnChangeComplete = (value) => {
    const vests = parseFloat(value).toFixed(6);
    const props = this.props.steem.props;
    const totalVestsSteem = parseFloat(props.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(props.total_vesting_shares.split(" ")[0])
    const sp = totalVestsSteem * vests / totalVests;
    const perWeek = Math.round(sp / 13 * 1000) / 1000;
    this.setState({ vests, sp, perWeek });
  }


  render() {
    const {
      account_vesting_withdraw_error,
      account_vesting_withdraw_pending,
      account_vesting_withdraw_resolved
    } = this.props.processing;
    return (
      <Modal
        size="small"
        open
        header="Cancel - Power Down"
        content={
          <Form
            error={account_vesting_withdraw_error}
            loading={account_vesting_withdraw_pending}
          >
            <Segment
              padded
              basic
            >
              <p>
                Cancelling this power down cannot be reversed. Any progress
                on your current week's credit will be reset, and if you power
                down again, you'll have to wait another 7 days for it to begin.
              </p>
              <Message
                error
                header="Operation Error"
                content={account_vesting_withdraw_error}
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
            disabled: account_vesting_withdraw_pending
          },
          {
            key: 'yes',
            type: 'submit',
            content: 'Cancel Power Down',
            color: 'blue',
            onClick: this.handleConfirm,
            disabled: account_vesting_withdraw_pending
          }
        ]}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    keys: state.keys,
    steem: state.steem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...KeysActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CancelPowerDownPrompt);
