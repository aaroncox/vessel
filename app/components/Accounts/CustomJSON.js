// @flow
import React, { Component } from 'react';
import { Grid, Header, Message, Segment, Select, Table } from 'semantic-ui-react';

import { Form, Input } from 'formsy-semantic-ui-react';

import AccountName from '../global/AccountName';

export default class AccountsCustomJSON extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: props.keys.names[0],
      id: '',
      json: '',
      message: false,
      permission: 'posting',
    }
  }

  resetState(extraState) {
    this.setState(Object.assign({}, {
      id: '',
      json: ''
    }, extraState))
  }


  handleIdChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      id: value
    })
  }

  handleJsonChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      json: value.trim()
    })
  }

  handleAccountChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      account: value
    })
  }

  handlePermissionChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      permission: value
    })
  }

  onValidSubmit = (
    e: SyntheticEvent
  ) => {
    const { account, id, json, permission } = this.state
    this.setState({message: false})
    this.props.actions.useKey('customJson', { account, id, json, permission }, this.props.keys.permissions[account]);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_custom_json_resolved) {
      nextProps.actions.customJsonCompleted();
      this.resetState({
        'message': 'Your transaction was successfully broadcast.'
      });
    }
  }

  render() {
    const {
      account_custom_json_error,
      account_custom_json_pending,
      account_custom_json_resolved
    } = this.props.processing;
    const keys = this.props.keys;
    const availableFrom = keys.names.map((name) => {
      const hasPermission = (keys.permissions[name].type === 'active' || keys.permissions[name].type === 'owner');
      return hasPermission ? {
        key: name,
        text: name,
        value: name
      } : {
        key: name,
        disabled: true,
        text: name + ' (unavailable - active/owner key not loaded)'
      };
    });
    const availablePermissions = ['active', 'posting'].map((permission) => ({
      key: permission,
      text: permission,
      value: permission
    }))
    let message = false
    if(this.state.message) {
      message = (
        <Message
          success
          header="Operation Complete"
          content={this.state.message}
        />
      )
    }
    console.log(this.state)
    return (
      <Segment basic padded>
        <Header>
          <Header.Subheader>
            Broadcast a Custom JSON operation to the Steem blockchain.
          </Header.Subheader>
        </Header>
        {message}
        <Form
          onValidSubmit={this.onValidSubmit}
          error={account_custom_json_error}
          loading={account_custom_json_pending}
          >
          <Form.Field
            control={Select}
            value={this.state.account}
            name="from"
            label="Select an account to broadcast with"
            options={availableFrom}
            placeholder="Sending Account..."
            onChange={this.handleAccountChange}
          />
          <Form.Field
            control={Select}
            value={this.state.permission}
            name="permission"
            label="Select a permission to use"
            options={availablePermissions}
            placeholder="Permission"
            onChange={this.handlePermissionChange}
          />
          <Form.Input
            label="ID"
            name="id"
            value={this.state.id}
            onChange={this.handleIdChange}
            placeholder=""
          />
          <Form.TextArea
            label="JSON"
            name="json"
            value={this.state.json}
            onChange={this.handleJsonChange}
            placeholder=""
          />
          <Message
            error
            header="Operation Error"
            content={account_custom_json_error}
          />
          <Form.Button
            color='blue'
            content='Broadcast'
            disabled={account_custom_json_pending}
          />
        </Form>
      </Segment>
    );
  }
}
