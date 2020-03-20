// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputRange from 'react-input-range';
import { Divider, Grid, Header, Message, Modal, Segment, Button, Icon } from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react';
import NumericLabel from '../../utils/NumericLabel';
import AccountName from '../global/AccountName';

import * as AccountActions from '../../actions/account';
import * as KeysActions from '../../actions/keys';

const defaultState = {
  hiveAmount: 0.001,
  to_account: false,
  edit_account: false,
  showPreview: false,
};

class PowerUpPrompt extends Component {

  constructor(props) {
    super(props);
    const name = props.targetAccount;
    const account = props.account.accounts[name];
    const balance = parseFloat(account.balance.split(' ')[0]);

    this.state = {
      maximum: balance,
      balance,
      ...defaultState
     };
  }

  handlePreview = (e: SyntheticEvent) => {
    this.setState({showPreview: true})
    e.preventDefault();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.processing.account_power_up_resolved !== this.props.processing.account_power_up_resolved) {
      if(this.props.processing.account_power_up_resolved) {
        console.log("this.props.actions")
        console.log(this.props.actions)
        this.props.actions.powerUpCompleted();
        this.props.handleCancel();
        this.setState({showPreview: false})
      }
    }
  }

  handleSubmit = (e: SyntheticEvent) => {
    const from_account = this.props.targetAccount;
    const to_account = this.state.to_account ? this.state.to_account : this.props.targetAccount;
    const permissions = this.props.keys.permissions;
    const hiveAmount = this.state.hiveAmount;
    this.props.actions.useKey('powerUp', { from_account, to_account, hiveAmount }, permissions[from_account]);
    e.preventDefault();
  }

  handleCancel = (e: SyntheticEvent) => {
    // Reset to the default state
    this.state = defaultState;
  }

  handleOnChange = (value) => {
    const hiveAmount = parseFloat(value);
    // const props = this.props.hive.props;
    this.setState({ hiveAmount });
  }

  handleOnChangeComplete = (value) => {
    const hiveAmount = parseFloat(value);
    // const props = this.props.hive.props;
    this.setState({ hiveAmount });
  }

  handleAccountChange = (event) => {
    this.setState({to_account: event.target.value})
  }


  render() {
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    const {
      account_power_up_error,
      account_power_up_pending,
      account_power_up_resolved
    } = this.props.processing;
    let prompt = false;
    if (this.state.hiveAmount) {
      prompt = !this.state.showPreview ? (
        <Modal
          size="small"
          open={!account_power_up_resolved}
          header="Power Up Account"
          content={
            <Form
              error={account_power_up_error}
              loading={account_power_up_pending}
            >
              <Segment
                padded
                basic
              >
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Header textAlign="center" size="large">
                        <Header.Subheader>Power Up From</Header.Subheader>
                        <AccountName name={this.props.targetAccount} />
                        <Header.Subheader>Power Up To</Header.Subheader>
                        {this.state.edit_account ? 
                          <Form>
                            <Form.Input
                              name="to_account"
                              value={this.state.to_account}
                              onChange={this.handleAccountChange}
                              placeholder="Account to Power Up"
                            />
                          </Form> :
                          <AccountName name={this.state.to_account ? this.state.to_account : this.props.targetAccount} />}
                          {!this.state.edit_account && <Button
                            icon="edit"
                            color="orange"
                            style={{fontSize: '15px', padding: '8px 8px 8px 10px', marginLeft: '10px'}}
                            onClick={() => {this.setState({edit_account: true})}}
                            value={name} />}
                      </Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header textAlign="center" color="green" size="large">
                        <Header.Subheader>Power Up Amount</Header.Subheader>
                        +<NumericLabel params={numberFormat}>{this.state.hiveAmount}</NumericLabel>
                        {' HIVE'}
                      </Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Divider />
                <Segment padded="very" basic>
                  <InputRange
                    maxValue={this.state.maximum}
                    step={0.001}
                    minValue={0.001}
                    value={this.state.hiveAmount}
                    onChange={this.handleOnChange}
                    onChangeComplete={this.handleOnChangeComplete}
                  />
                </Segment>
                <Message
                  content="Drag the slider to adjust the amount of HIVE to power up as HP."
                />
                <Message
                  error
                  header='Operation Error'
                  content={account_power_up_error}
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
              disabled: account_power_up_pending
            },
            {
              key: 'yes',
              type: 'submit',
              content: 'Power Up',
              color: 'blue',
              onClick: this.handlePreview,
              disabled: account_power_up_pending
            }
          ]}
        />
      ) : (
        <Modal
          size="small"
          open
          header="Power Up Account"
          content={
            <Form
              error={account_power_up_error}
              loading={account_power_up_pending}
            >
              <Segment
                padded
                basic
              >
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Header textAlign="center" size="large">
                        <Header.Subheader>Power Up From</Header.Subheader>
                        <AccountName name={this.props.targetAccount} />
                        <Header.Subheader>Power Up To</Header.Subheader>
                        <AccountName name={this.state.to_account ? this.state.to_account : this.props.targetAccount} />
                      </Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header textAlign="center" color="green" size="large">
                        <Header.Subheader>Power Up Amount</Header.Subheader>
                        +<NumericLabel params={numberFormat}>{this.state.hiveAmount}</NumericLabel>
                        {' HIVE'}
                      </Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Divider />
                <Message
                  error
                  header='Operation Error'
                  content={account_power_up_error}
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
              disabled: account_power_up_pending
            },
            {
              key: 'yes',
              type: 'submit',
              content: 'Confirm - Power Up',
              color: 'blue',
              onClick: this.handleSubmit,
              disabled: account_power_up_pending
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
    hive: state.hive
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...KeysActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PowerUpPrompt);
