// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Button, Divider, Grid, Header, Segment } from 'semantic-ui-react';

import KeysGenerate from './Generate';
import KeysImport from './Import';
import KeysLogin from './Login';
import KeysCreate from './Create';

export default class Welcome extends Component {

  state = {
    importMethod: false
  }
  handleMethodChange = (e, props) => this.setState({ importMethod: props.value })
  handleMethodReset = (e, props) => this.setState({ importMethod: false })

  render() {
    let display = (
      <Segment.Group>
        <Segment padded>
          <Header>
            Import a steemit.com account
            <Header.Subheader>
              By using your steemit.com username and password, your private
              keys can be derived and imported into your wallet.
            </Header.Subheader>
          </Header>
          <Button
            color="green"
            size="large"
            onClick={this.handleMethodChange}
            value="login-steemit"
          >
            Import a steemit.com account
          </Button>
        </Segment>
        <Segment padded>
          <Header>
            Import a private key
            <Header.Subheader>
              Any type of private key can be imported into your wallet,
              granting different levels of permission based on the key used.
            </Header.Subheader>
          </Header>
          <Button
            color="green"
            size="large"
            onClick={this.handleMethodChange}
            value="import-private-key"
          >
            Import a private key
          </Button>
        </Segment>
        <Segment padded>
          <Header>
            Experimental - Generate New Private Keys
            <Header.Subheader>
              For advanced users.
              Create a new set of public and private keys for a new Steem
              account. These <strong>public</strong> keys can then be given
              to another user or service allowing the creation of an account.
            </Header.Subheader>
          </Header>
          <Button
            color="black"
            size="large"
            onClick={this.handleMethodChange}
            value="generate-private-key"
          >
            Generate new private keys
          </Button>
        </Segment>
      </Segment.Group>
    );
    switch (this.state.importMethod) {
      case 'import-private-key':
        display = (
          <KeysImport
            handleMethodReset={this.handleMethodReset}
            {...this.props}
          />
        );
        break;
      case 'login-steemit':
        display = (
          <KeysLogin
            handleMethodReset={this.handleMethodReset}
            {...this.props}
          />
        );
        break;
      case 'generate-private-key':
        display = (
          <KeysGenerate
            handleMethodReset={this.handleMethodReset}
            {...this.props}
          />
        );
        break;
      default: {
        break;
      }
    }
    return display;
  }
}
