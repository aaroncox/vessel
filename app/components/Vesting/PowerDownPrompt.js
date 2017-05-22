// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputRange from 'react-input-range';
import { Divider, Grid, Header, Message, Modal, Segment } from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react';
import NumericLabel from '../../utils/NumericLabel';
import AccountName from '../global/AccountName';

import * as KeysActions from '../../actions/keys';

const defaultState = {
  vests: 1
};

class PowerDownPrompt extends Component {

  constructor(props) {
    super(props);
    const name = props.targetAccount;
    const account = props.account.accounts[name];
    const vests = parseFloat(account.vesting_shares.split(" ")[0]);
    const totalVestsSteem = parseFloat(props.steem.props.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(props.steem.props.total_vesting_shares.split(" ")[0])
    const sp = totalVestsSteem * vests / totalVests;
    const perWeek = Math.round(sp / 13 * 1000) / 1000;
    this.state = {
      maximum: vests,
      perWeek,
      sp,
      vests,
     };
  }

  handleSubmit = (e: SyntheticEvent) => {
    const account = this.props.targetAccount;
    const permissions = this.props.keys.permissions;
    const vests = this.state.vests;
    // console.log('withdrawVesting', { account, vests }, permissions[account]);
    this.props.actions.useKey('withdrawVesting', { account, vests }, permissions[account]);
    e.preventDefault();
  }

  handleCancel = (e: SyntheticEvent) => {
    // Reset to the default state
    this.state = defaultState;
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
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    const {
      account_vesting_withdraw_error,
      account_vesting_withdraw_pending,
      account_vesting_withdraw_resolved
    } = this.props.processing;
    let prompt = false;
    if (this.state.sp) {
      prompt = (
        <Modal
          size="small"
          open
          header="Power Down Account"
          content={
            <Form
              error={account_vesting_withdraw_error}
              loading={account_vesting_withdraw_pending}
            >
              <Segment
                padded
                basic
              >
                <Grid>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Header textAlign="center" size="large">
                        <Header.Subheader>Power Down Target</Header.Subheader>
                        <AccountName name={this.props.targetAccount} />
                        <Header.Subheader>over 13 weeks</Header.Subheader>
                      </Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header textAlign="center" color="red" size="large">
                        <Header.Subheader>Power Down Amount</Header.Subheader>
                        -<NumericLabel params={numberFormat}>{this.state.sp}</NumericLabel>
                        {' SP'}
                        <Header.Subheader>
                          -<NumericLabel params={numberFormat}>{this.state.vests}</NumericLabel>
                          {' VESTS'}
                        </Header.Subheader>
                      </Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header textAlign="center" color="green" size="large">
                        <Header.Subheader>Estimated Weekly</Header.Subheader>
                          +{this.state.perWeek}
                        <Header.Subheader>STEEM</Header.Subheader>
                      </Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Divider />
                <Segment padded="very" basic>
                  <InputRange
                    maxValue={this.state.maximum}
                    minValue={0.000001}
                    value={this.state.vests}
                    onChange={this.handleOnChange}
                    onChangeComplete={this.handleOnChangeComplete}
                  />
                </Segment>
                <Message
                  content="Drag the slider to adjust the amount of SP/VESTS to convert to STEEM over the next 13 weeks."
                />
                <Message
                  error
                  header='Operation Error'
                  content={account_vesting_withdraw_error}
                />
              </Segment>
            </Form>
          }
          actions={[
            {
              key: 'no',
              content: 'Cancel',
              floated: 'left',
              color: 'red',
              onClick: this.props.handleCancel,
              disabled: account_vesting_withdraw_pending
            },
            {
              key: 'yes',
              type: 'submit',
              content: 'Begin Power Down',
              color: 'blue',
              onClick: this.handleSubmit,
              disabled: account_vesting_withdraw_pending
            }
          ]}
        />
      );
    }
    return prompt;
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

export default connect(mapStateToProps, mapDispatchToProps)(PowerDownPrompt);
