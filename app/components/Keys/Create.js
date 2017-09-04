// @flow
import React, { Component } from 'react';
import steem from 'steem';
import _ from 'lodash';
import { Button, Checkbox, Divider, Grid, Header, Icon, Label, Message, Segment, Input, Select, Table, Modal } from 'semantic-ui-react';
import KeysConfirm from './Confirm';

var bip39 = require('bip39');

export default class KeysCreate extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    requestedName: false,
    requestedOwner: false,
    usernameAvailable: false,
    mnemonic: false,
    requestedFundingMethod: false,
    modalPreview: false
  }
  checkUsername = _.debounce((e, props) => {
    const name = props.value.trim();
    console.log("name: [" + name + "]")
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

  checkOwner = _.debounce((e, props) => {
    const name = props.value.trim();
    console.log("owner: [" + name + "]")
    if (name === "") {
      this.setState({
        checkingOwner: false,
        requestedOwner: false,
        ownerAvailable: false
      });
      return;
    }
    this.setState({
      checkingOwner: true
    });
    this.setState({
      checkingOwner: false,
      requestedOwner: name,
      ownerAvailable: true
    });
  }, 500);

  checkFundingMethod = _.debounce((e, props) => {
    const fundingMethod = props.value.trim();
    this.setState({requestedFundingMethod: fundingMethod})
  }, 500);

  generateSeed = () => {
    let mnemonic = bip39.generateMnemonic();
    const name = this.state.requestedName;
    const password = bip39.mnemonicToSeedHex(mnemonic);
    const types = ['owner', 'active', 'posting', 'memo'];
    let pub = steem.auth.generateKeys(name, password, types);
    let prv = steem.auth.getPrivateKeys(name, password, types);
    this.setState({mnemonic, pub, prv, password});
  }

  createAccount = () => {
    this.generateSeed();
    this.setState({modalPreview: true});
  }

  handleCancel = (e: SyntheticEvent) => {
    this.setState({
      modalPreview: false
    });
    e.preventDefault();
  }

  handleConfirm = (e: SyntheticEvent) => {
    const { requestedOwner, requestedName, requestedFundingMethod, password } = this.state;
    let creatorKey = this.props.keys.permissions[requestedOwner];
    this.props.actions.useKey('createAccountDelegated',
      {
        creator: requestedOwner,
        username: requestedName,
        password: password
      }, creatorKey);
    const { addKeyConfirmed } = this.props.actions;
    addKeyConfirmed(requestedName, this.state.prv.active, 'active', false, '');
    this.setState({
      modalPreview: false
    });
    this.props.handleMethodReset;
    e.preventDefault();
  }
  render() {
    let modal = false;
    const accounts = this.props.account.accounts;
    const keys = this.props.keys;
    const availableOwner = keys.names.map((name) => {
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
    const availableFundingMethods = ['STEEM','VESTS'].map((name) => {
      return name === 'STEEM' ? {
        key:name,
        text:name,
        value:name
      } : {
        key:name,
        text:name + ' (SP)',
        value:name
      };
    });

    function setClipboardText(text){
      var id = "vessel-clipboard-textarea-hidden-id";
      var existsTextarea = document.getElementById(id);

      if(!existsTextarea){
        console.log("Creating textarea");
        var textarea = document.createElement("textarea");
        textarea.id = id;
        // Place in top-left corner of screen regardless of scroll position.
        textarea.style.position = 'fixed';
        textarea.style.top = 0;
        textarea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textarea.style.width = '1px';
        textarea.style.height = '1px';

        // We don't need padding, reducing the size if it does flash render.
        textarea.style.padding = 0;

        // Clean up any borders.
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textarea.style.background = 'transparent';
        document.querySelector("body").appendChild(textarea);
        console.log("The textarea now exists");
        existsTextarea = document.getElementById(id);
      }else{
          console.log("The textarea already exists")
      }

      existsTextarea.value = text;
      existsTextarea.select();

      try {
        var status = document.execCommand('copy');
        if(!status){
          console.error("Cannot copy text");
        }else{
          console.log("The text is now on the clipboard");
        }
      } catch (err) {
        console.log('Unable to copy.');
      }
    }

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
    if (this.state.modalPreview) {
      modal = (
        <Modal
          open
          header="Please confirm the details of this transaction"
          content={
            <Segment basic padded>
              <p>
                Ensure that all of the data below looks correct before continuing.
                If everything looks good, click <strong>Confirmed - Create Account</strong>.
              </p>
              <Table
                definition
                collapsing
                style={{ minWidth: '300px', margin: '0 auto' }}
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="right">Field</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Owner:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.requestedOwner}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Account:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.requestedName}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <br /><hr />
              <Header>
                Generated Seed
                <Header.Subheader>
                  WRITE THIS DOWN (or save in password manager). This is your main account password.
                </Header.Subheader>
              </Header>
              <Segment>
                {this.state.password}
              </Segment>
              <Button
                color="green"
                content="Copy to clipboard"
                onClick={()=> setClipboardText(this.state.mnemonic)}
                disabled={!this.state.mnemonic}
              />
              <Header>
                Key Backup JSON
                <Header.Subheader>
                  NEVER share these keys with anyone and back them up to a safe place.
                </Header.Subheader>
              </Header>
              <Segment>
                <pre>{JSON.stringify(privatekeys, null, 2)}</pre>
              </Segment>
              <Segment basic textAlign="center">
                <Button
                  color="green"
                  content="Copy to clipboard"
                  onClick={()=> setClipboardText(JSON.stringify(privatekeys, null, 2))}
                  disabled={!this.state.mnemonic}
                />
              </Segment>
            </Segment>
          }
          actions={[
            {
              key: 'no',
              icon: 'cancel',
              content: 'Cancel',
              color: 'red',
              floated: 'left',
              onClick: this.handleCancel
            },
            {
              key: 'yes',
              icon: 'checkmark',
              content: 'Confirmed - Create Account',
              color: 'green',
              onClick: this.handleConfirm
            }
          ]}
        />
      );
    }
    let display = (
      <div>
        <Header size="huge">
          Create New Account
          <Header.Subheader>
            This feature is under development. Use at your own risk.
          </Header.Subheader>
        </Header>
        <p>This process costs 6SP or equivalent vests + 0.200 STEEM from a previously imported Vessel account.</p>
        <ul>
          <li>Enter a username to see if it is taken or available.</li>
          <li>Click <strong>Create This Account</strong> to create the account to review the provided information.</li>
          <li>If everything looks good, click <strong>Confirm</strong> to proceed.</li>
          <li>Once the account has been created, you can use it via Vessel as well as on SteemIt.</li>
        </ul>
        <Segment textAlign="center">
          <Segment basic>
            <p>Select owner account.</p>
              <Select
                value={this.state.requestedOwner}
                name="owner"
                label="Select the owner account"
                options={availableOwner}
                placeholder="Owner Account..."
                onChange={this.checkOwner}
              />
          </Segment>
          <Segment basic>
            <p>Specify a name for the new account.</p>
            <Input
              labelPosition="right"
              name="username"
              onChange={this.checkUsername}
            >
              <input />
              <Label
                color={this.state.checkingUsername ? 'teal' : this.state.usernameAvailable ? 'green' : 'red'}
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
          <Segment basic>
            <Button
              size="large"
              color="blue"
              content="Create Account"
              onClick={this.createAccount}
              disabled={!(this.state.usernameAvailable && this.state.ownerAvailable)}
            />
          </Segment>
        </Segment>
        <Segment basic textAlign="center">
          <Button
            size="large"
            color="red"
            content="Close"
            onClick={this.props.handleMethodReset}
          />
        </Segment>
        {modal}
      </div>
    );
    return display;
  }
}
