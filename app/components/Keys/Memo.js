// @flow
import React, { Component } from 'react';
import steem from 'steem';
import { Button, Checkbox, Divider, Form, Grid, Header, Message, Segment, Table } from 'semantic-ui-react';

export default class KeysMemo extends Component {
  constructor(props) {
    super(props);
    this.state.account = this.props.keys.confirmMemo.account;
    this.state.public = this.props.keys.confirmMemo.public;
    this.state.errors = this.validate(this.state);
  }
  state = {
    account: '',
    wif: '',
    errors: {
      wif_error_invalid: false,
      wif_not_valid: false,
    }
  }

  handleChange = (
    e: SyntheticEvent, { name, value }: { name: string, value: string }
  ) => {
    const newState = Object.assign({}, this.state, {
      [name]: value
    });
    newState.errors = this.validate(newState);
    this.setState(newState);
  }

  validate = (newState) => {
    const errors = {};
    errors.wif_error_invalid = !steem.auth.isWif(newState.wif);
    errors.wif_not_valid = true;
    if (newState.wif && steem.auth.wifIsValid(newState.wif, newState.public) === true) {
      errors.wif_not_valid = false;
    }
    return errors;
  }

  hasErrors = () => {
    const errors = this.state.errors;
    return !!Object.keys(errors).filter((error) => errors[error]).length;
  }

  handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const { addMemoKey } = this.props.actions;
    const { account, wif } = this.state;
    addMemoKey(account, wif);
  }

  render() {
    const { account, wif } = this.state;
    const errors = this.state.errors;
    const hasErrors = this.hasErrors();
    const messages = {
      wif_error_invalid: 'They WIF Private Key you have is not valid.',
      wif_not_valid: 'The WIF Private Key does not match the memo key of this account.'
    };
    let handleMethodReset = false;
    if (this.props.handleMethodReset) {
      handleMethodReset = (
        <Segment basic textAlign="center">
          <Button
            size="large"
            color="red"
            content="Cancel"
            onClick={this.props.handleMethodReset}
          />
        </Segment>
      );
    }
    let message = false;
    let warning = false;
    if (hasErrors) {
      if (errors.wif_not_valid) {
        message = messages.wif_not_valid;
      }
      if (errors.wif_error_invalid) {
        message = messages.wif_error_invalid;
      }
      warning = (
        <Message
          error
          icon="warning"
          content={message}
        />
      );
    }
    let display = (
      <Segment padded>
        <Message
          error
          icon="warning"
          content="This feature is intended for advanced users only, please make sure you know what you're doing while encrypting memos. Using this feature incorrectly may cause the loss of funds deposited to an exchange."
        />
        <Header>
          <Header.Subheader>
            If you'd like to encrypt transaction memos from this account, please add the memo private key associated to the specified account:
          </Header.Subheader>
        </Header>
        <Divider hidden />
        <Form
          error={hasErrors}
        >
          <Grid divided>
            <Grid.Row>
              <Grid.Column width={16}>
                <Form.Input
                  fluid
                  label="Account Name"
                  name="account"
                  value={this.props.keys.confirmMemo.account}
                />
                <Form.Input
                  fluid
                  label="Public Memo Key"
                  name="public"
                  value={this.props.keys.confirmMemo.public}
                />
                <Form.Input
                  label="WIF Memo Private Key"
                  type="password"
                  name="wif"
                  value={wif}
                  onChange={this.handleChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {warning}
          <Divider />
          <Button disabled={hasErrors} fluid size="large" color="green" onClick={this.handleSubmit}>
            Add Memo Key
          </Button>
          {handleMethodReset}
        </Form>
      </Segment>
    );
    return display;
  }
}
