// @flow
import React, { Component } from 'react';
import steem from 'steem';
import _ from 'lodash';
import { Button, Checkbox, Divider, Form, Grid, Header, Icon, Input, Label, Message, Segment } from 'semantic-ui-react';
import KeysConfirm from './Confirm';

var bip39 = require('bip39');

export default class KeysGenerate extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    requestedName: false,
    usernameAvailable: false,
    mnemonic: false
  }
  checkUsername = _.debounce((e, props) => {
    const name = props.value.trim();
    console.log("[" + name + "]")
    if (name === "") {
      this.setState({
        checkingUsername: false,
        requestedName: false,
        usernameAvailable: false
      });
      return;
    }
    this.setState({
      checkingUsername: true
    });
    steem.api.getAccounts([name], (err, results) => {
      this.setState({
        checkingUsername: false,
        requestedName: (!err && !results.length) ? name : false,
        usernameAvailable: (!err && !results.length)
      });
    });

  }, 500);

  generateSeed = () => {
    let mnemonic = bip39.generateMnemonic();
    const name = this.state.requestedName;
    const password = bip39.mnemonicToSeedHex(mnemonic);
    const types = ['owner', 'active', 'posting', 'memo'];
    let pub = steem.auth.generateKeys(name, password, types);
    let prv = steem.auth.getPrivateKeys(name, password, types);
    this.setState({mnemonic, pub, prv});
  }
  render() {
    let sharable = {};
    let privatekeys = {};
    console.log(this.state);
    if (this.state.requestedName && this.state.pub) {
      sharable = {
        account: this.state.requestedName,
        public_keys: this.state.pub
      }
      privatekeys = {
        account: this.state.requestedName,
        keys: this.state.prv
      }
    }
    let display = (
      <div>
        <Header size="huge">
          Experimental - Generating Keys
          <Header.Subheader>
            This feature is for advanced users with a deep understanding of Steem.
          </Header.Subheader>
        </Header>
        <p>Create a new set of public and private keys for a new Steem account.</p>
        <p>This is a multi-step process and requires either using a service or knowing another user to complete.</p>
        <ul>
          <li>Using Vessel, generate mnemonic phrase along with a set of keys.</li>
          <li>Send the <strong>Public Key JSON</strong> to a service or user for account creation.</li>
          <li>Once the account has been created, use your mnemonic seed to load the wallet with your key.</li>
        </ul>
        <Segment>
          <p>In order to generate a set of keys, please specify the username they will be associated to. These keys will only work with the specified account. If the username is already taken, you will have to generate a new set of keys.</p>
          <Input
            labelPosition="right"
            name="username"
            onChange={this.checkUsername}
          >
            <input />
            <Label
              color={this.state.checkingUsername ? 'white' : this.state.usernameAvailable ? 'green' : 'red'}
              >
              <Icon
                fitted
                loading={this.state.checkingUsername}
                name={this.state.checkingUsername ? 'asterisk' : this.state.usernameAvailable ? 'checkmark' : 'cancel'}
              />
              {this.state.checkingUsername ? 'Checking' : this.state.usernameAvailable ? 'Available' : 'Taken'}
            </Label>
          </Input>
        </Segment>
        <Segment basic padded>
          <Button
            color="green"
            content="Generate Seed + Keys"
            onClick={this.generateSeed}
            disabled={!this.state.usernameAvailable}
          />
        </Segment>
        <Segment>
          <Header>
            Generated Seed
            <Header.Subheader>
              WRITE THIS DOWN. This series of words is your backup to restore your wallet.
            </Header.Subheader>
          </Header>
          <Segment>
            {this.state.mnemonic}
          </Segment>
        </Segment>
        <Segment>
          <Header>
            Public Key JSON
            <Header.Subheader>
              Give this information to the person or service who is creating your account.
            </Header.Subheader>
          </Header>
          <Segment>
            <pre>{JSON.stringify(sharable, null, 2)}</pre>
          </Segment>
        </Segment>
        <Segment>
          <Header>
            Key Backup JSON
            <Header.Subheader>
              NEVER share these keys with anyone and back them up to a safe place.
            </Header.Subheader>
          </Header>
          <Segment>
            <pre>{JSON.stringify(privatekeys, null, 2)}</pre>
          </Segment>
        </Segment>
      </div>
    );



    // const { account, wif, encryptWallet, lock1, lock2 } = this.state;
    // const confirmAccount = this.props.keys.confirm;
    // const errors = this.state.errors;
    // const hasErrors = this.hasErrors();
    // const messages = {
    //   account_name_required: 'An existing account name is required.',
    //   password_error_not_set: 'You must set a password to enable encryption.',
    //   password_error_no_match: 'The passwords you have entered do not match.',
    //   wif_error_invalid: 'They WIF Private Key you have entered is invalid.',
    // };
    // let passwordInput = false;
    // let handleMethodReset = false;
    // if (this.props.handleMethodReset) {
    //   handleMethodReset = (
    //     <Segment basic textAlign="center">
    //       <Button
    //         size="large"
    //         color="red"
    //         content="Cancel"
    //         onClick={this.props.handleMethodReset}
    //       />
    //     </Segment>
    //   );
    // }
    // let passwordWarning = (
    //   <Message
    //     icon="warning"
    //     header="Notice about Unencrypted Wallets"
    //     content="If you choose not to encrypt your wallet, your private keys will be stored on your computer unencrypted. This greatly increases the risk of your account being comprimised in the event your computer is hacked."
    //   />
    // );
    // let message = false;
    // let warning = false;
    // if (hasErrors || this.props.keys.lastError) {
    //   if (this.props.keys.lastError) {
    //     message = this.props.keys.lastError;
    //   }
    //   if (errors.password_error_not_set) {
    //     message = messages.password_error_not_set;
    //   }
    //   if (errors.password_error_no_match) {
    //     message = messages.password_error_no_match;
    //   }
    //   if (errors.wif_error_invalid) {
    //     message = messages.wif_error_invalid;
    //   }
    //   if (errors.account_name_required) {
    //     message = messages.account_name_required;
    //   }
    //   warning = (
    //     <Message
    //       error
    //       icon="warning"
    //       content={message}
    //     />
    //   );
    // }
    // if (encryptWallet) {
    //   passwordInput = (
    //     <div>
    //       <Form.Input label="Wallet Password" type="password" name="lock1" value={lock1} onChange={this.handleChange} />
    //       <Form.Input label="Wallet Password (Repeat)" type="password" name="lock2" value={lock2} onChange={this.handleChange} />
    //       <p>
    //         The wallet password is only used to unlock your
    //         accounts stored within the Vessel wallet.
    //       </p>
    //     </div>
    //   );
    //   passwordWarning = (
    //     <Message
    //       icon="warning"
    //       header="Notice about Encryption"
    //       content="If you lose your password, you will be unable to recover your keys from this application. Please make sure you have backed up your keys and remember your password."
    //     />
    //   );
    // }
    // let display = (
    //   <div>
    //     <Header>
    //       <Header.Subheader>
    //         Enter an account name and a WIF private key for the account
    //         you would like to add. Different permissions will be granted
    //         to this wallet based on the type of key used.
    //       </Header.Subheader>
    //     </Header>
    //     <Divider hidden />
    //     <Form
    //       error={hasErrors || this.props.keys.lastError}
    //       loading={this.props.processing.account_loading}
    //     >
    //       <Grid divided>
    //         <Grid.Row>
    //           <Grid.Column width={8}>
    //             <Form.Input
    //               label="Account Name"
    //               name="account"
    //               value={account}
    //               onChange={this.handleChange}
    //             />
    //             <Form.Input
    //               label="WIF Private Key (posting, active or owner)"
    //               type="password"
    //               name="wif"
    //               value={wif}
    //               onChange={this.handleChange}
    //             />
    //             <Divider hidden />
    //             <Checkbox
    //               toggle
    //               name="encryptWallet"
    //               label="Encrypt this Wallet for better security"
    //               checked={encryptWallet}
    //               value={encryptWallet ? 'off' : 'on'}
    //               onChange={this.handleToggle}
    //             />
    //           </Grid.Column>
    //           <Grid.Column width={8}>
    //             {passwordInput}
    //           </Grid.Column>
    //         </Grid.Row>
    //       </Grid>
    //       <Divider hidden />
    //       <Divider />
    //       {passwordWarning}
    //       {warning}
    //       <Button disabled={hasErrors} fluid size="large" color="green" onClick={this.handleSubmit}>
    //         Add to Wallet
    //       </Button>
    //       {handleMethodReset}
    //     </Form>
    //   </div>
    // );
    // if (confirmAccount) {
    //   display = (
    //     <KeysConfirm
    //       handleConfirmAction={this.handleConfirmAction}
    //       encryptWallet={this.state.encryptWallet}
    //       {...this.props}
    //     />
    //   );
    // }
    return display;
  }
}
