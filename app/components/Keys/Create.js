// @flow
import React, { Component } from 'react';
import steem from 'steem';
import _ from 'lodash';
import { Button, Checkbox, Divider, Grid, Header, Icon, Label, List, Message, Segment, Input, Select, Table, Modal } from 'semantic-ui-react';
import KeysConfirm from './Confirm';

var bip39 = require('bip39');

export default class KeysCreate extends Component {
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
    const seed = bip39.mnemonicToSeedHex(mnemonic);
    let masterKey = steem.auth.getPrivateKeys(name, seed, ['master']);
    let password = 'P' + masterKey.master;
    const types = ['owner', 'active', 'posting', 'memo'];
    let pub = steem.auth.generateKeys(name, password, types);
    let prv = steem.auth.getPrivateKeys(name, password, types);
    this.setState({mnemonic, pub, prv, password});
  }

  createAccount = () => {
    this.generateSeed();
    this.props.actions.processingAccountCreateCancel();
    this.setState({modalPreview: true});
  }

  handleCancel = (e: SyntheticEvent) => {
    this.setState({
      modalPreview: false
    });
    e.preventDefault();
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_create_resolved) {
      const { addKeyConfirmed } = this.props.actions;
      const { requestedName } = this.state;
      addKeyConfirmed(requestedName, this.state.prv.active, 'active', false, '');
      this.setState({
        modalPreview: false
      });
      this.props.handleMethodReset();
      this.props.actions.processingAccountCreateCancel();
    }
  }

  handleConfirm = (e: SyntheticEvent) => {
    const { useKey } = this.props.actions;
    const { requestedOwner, requestedName, password } = this.state;
    let creatorKey = this.props.keys.permissions[requestedOwner];
    useKey('createAccountDelegated', {
      creator: requestedOwner,
      username: requestedName,
      password
    }, creatorKey);
    e.preventDefault();
  }
  render() {
    let modal = false;
    const accounts = this.props.account.accounts;
    const keys = this.props.keys;
    let errorMessage = false;
    if (this.props.processing && this.props.processing.account_create_error) {
      errorMessage = (
        <Message
          error
          icon="warning"
          content={this.props.processing.account_create_error}
        />
      )
    }

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
        existsTextarea = document.getElementById(id);
      }
      existsTextarea.value = text;
      existsTextarea.select();
      try {
        var status = document.execCommand('copy');
        if(!status){
          console.error("Cannot copy text");
        }else{
        }
      } catch (err) {
      }
    }

    let sharable = {};
    let privatekeys = {};
    if (this.state.requestedName && this.state.pub) {
      sharable = {
        account: this.state.requestedName,
        public_keys: this.state.pub
      }
      privatekeys = {
        account: this.state.requestedName,
        keys: (({ owner, active, posting, memo }) => ({ owner, active, posting, memo }))(this.state.prv),
      }
    }
    let delegation = {};
    if(this.props.account && this.props.account.minimumDelegation) {
      delegation = this.props.account.minimumDelegation;
    }
    if (this.state.modalPreview && delegation) {
      modal = (
        <Modal
          open
          header="Please backup the information below and then confirm the new account."
          content={
            <Segment
              loading={this.props.processing.account_create_pending}
              style={{ margin: 0 }}
              >
              <Grid>
                <Grid.Row>
                  <Grid.Column width={9}>
                    <Segment basic>
                      <Header>
                        Final Step - Account not yet created
                      </Header>
                      <p>
                        Ensure that all of the data below looks correct before continuing.
                        If everything looks good, click <strong>Create Account</strong> at
                        the bottom of this window.
                      </p>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <Segment basic>
                      <Table
                        collapsing
                      >
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell textAlign="right">
                              Originating Account:
                            </Table.Cell>
                            <Table.Cell>
                              {this.state.requestedOwner}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell textAlign="right">
                              New Account:
                            </Table.Cell>
                            <Table.Cell>
                              {this.state.requestedName}
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Segment basic>
                      <Header>
                        <Button
                          color="green"
                          content="Copy to clipboard"
                          floated="right"
                          onClick={()=> setClipboardText(this.state.password)}
                          disabled={!this.state.mnemonic}
                        />
                        New Account Password
                        <Header.Subheader>
                          WRITE THIS DOWN (or save in a password manager). This password will allow you to log into any Steem related service with full permissions. Use the posting private key if you only wish to grant posting permissions.
                        </Header.Subheader>
                      </Header>
                      <Segment>
                        {this.state.password}
                      </Segment>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Segment basic>
                      <Header>
                        <Button
                          color="green"
                          content="Copy to clipboard"
                          floated="right"
                          onClick={()=> setClipboardText(JSON.stringify(privatekeys, null, 2))}
                          disabled={!this.state.mnemonic}
                        />
                        Key Backup JSON
                        <Header.Subheader>
                          NEVER share these keys with anyone and back them up to a safe place.
                        </Header.Subheader>
                      </Header>
                      <Segment>
                        <pre>{JSON.stringify(privatekeys, null, 2)}</pre>
                      </Segment>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Message
                      icon='warning sign'
                      header='Ready to create?'
                      content='Ensure the steps above are completed and the data above has been copied elsewhere. The data displayed here can never be retrieved through Vessel again.'
                    />

                  </Grid.Column>
                </Grid.Row>
              </Grid>
              {errorMessage}
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
        <Grid divided>
          <Grid.Row>
            <Grid.Column width={7}>
              <Message negative>
                <Message.Content>
                  <Message.Header>New accounts require initial funds</Message.Header>
                  <p>
                   New accounts require funding in order to be created, which is transfered from the originating account. Currently to create an account, you must fund it initially with a minimum of:
                  </p>
                  <List bulleted>
                    <List.Item>STEEM: {delegation.fee.amount}</List.Item>
                    <List.Item>VESTS: {delegation.delegation.amount.toFixed(6)} (~{delegation.sp.amount.toFixed(3)} SP)</List.Item>
                  </List>
                </Message.Content>
              </Message>
              <Header size="small">
                Next steps...
              </Header>
              <List bulleted>
                <List.Item>Enter an account name to see if it is available.</List.Item>
                <List.Item>Click <strong>Generate Account</strong> to create the password and keys, while reviewing it's information.</List.Item>
                <List.Item>If everything looks good, click <strong>Create</strong> to submit the details to the blockchain, as well as funding it's initial balance.</List.Item>
                <List.Item>Once the account has been created, it will be automatically imported into Vessel, and you can use either the <strong>Master Password</strong> or the <strong>Posting Private Key</strong> to log into Steemit or any Steem powered website.</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={9}>
              <Segment basic>
                <p>Select the originating account, which will fund the new account.</p>
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
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
