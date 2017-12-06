// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Segment } from 'semantic-ui-react';
import { Form, Input } from 'formsy-semantic-ui-react'

import * as KeysActions from '../actions/keys';

var CryptoJS = require("crypto-js");

const defaultState = {
  password: '',
  decrypted: false,
};

class DecryptPrompt extends Component {

  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  handleKeyUp = (e) => {
    if (this.state.decrypted && e.key == 'Enter') {
      this.handleSubmit(e);
    }
  }

  handlePasswordChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const { from } = this.state;
    const { key } = this.props.keys.decrypt.auth;
    const decrypted = this.decryptKey(key, value);
    this.setState({
      password: value,
      decrypted: decrypted
    });
  }

  handleSubmit = (e: SyntheticEvent) => {
    const { operation, params, auth } = this.props.keys.decrypt;
    const { password } = this.state;
    const { key } = this.props.keys.decrypt.auth;
    // Extract the WIF key
    const decrypted = this.decryptKey(key, password);
    // Modify the auth information with the unencrypted information
    auth['encrypted'] = false;
    auth['key'] = decrypted;
    // Reissue the action with the unencrypted auth information
    this.props.actions.useKey(operation, params, auth);
    // Reset to the default state
    this.state = defaultState;
    e.preventDefault();
  }

  handleCancel = (e: SyntheticEvent) => {
    // Close the prompt
    this.props.actions.useKeyRequestDecryptClose();
    // Reset to the default state
    this.state = defaultState;
  }

  decryptKey(wif: string, password: string) {
    try {
      const bytes = CryptoJS.AES.decrypt(wif, password);
      const key = bytes.toString(CryptoJS.enc.Utf8);
      if (key) {
        return key;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  render() {
    let prompt = false;
    const decrypt = this.props.keys.decrypt;
    if (decrypt) {
      prompt = (
        <Modal
          size="small"
          open
          header="Decrypt Wallet to Broadcast Transaction"
          onOpen={this.focusInput}
          content={
            <Segment padded basic>
              <p>
                The wallet requested is encrypted locally. Please type your wallet password to broadcast the transaction to the blockchain.
              </p>
              <Form>
                <Input
                  name="password"
                  type="password"
                  focus
                  autoFocus
                  placeholder="Enter wallet password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  onKeyUp={this.handleKeyUp}
                />
              </Form>
            </Segment>
          }
          actions={[
            {
              key: 'no',
              content: 'Cancel Operation',
              floated: 'left',
              color: 'red',
              onClick: this.handleCancel
            },
            {
              key: 'yes',
              type: 'submit',
              content: 'Unlock + Broadcast',
              color: 'purple',
              onClick: this.handleSubmit,
              disabled: !this.state.decrypted
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

export default connect(mapStateToProps, mapDispatchToProps)(DecryptPrompt);
