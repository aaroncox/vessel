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

    function setClipboardText(text){
      var id = "mycustom-clipboard-textarea-hidden-id";
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
        console.log("The textarea now exists :)");
        existsTextarea = document.getElementById(id);
      }else{
          console.log("The textarea already exists :3")
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
          <Button
            color="green"
            content="Copy to clipboard"
            onClick={()=> setClipboardText(this.state.mnemonic)}
            disabled={!this.state.mnemonic}
          />
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
          <Button
            color="green"
            content="Copy to clipboard"
            onClick={()=> setClipboardText(JSON.stringify(sharable, null, 2))}
            disabled={!this.state.mnemonic}
          />
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
          <Button
            color="green"
            content="Copy to clipboard"
            onClick={()=> setClipboardText(JSON.stringify(privatekeys, null, 2))}
            disabled={!this.state.mnemonic}
          />
        </Segment>
        <Segment basic textAlign="center">
          <Button
            size="large"
            color="red"
            content="Close"
            onClick={this.props.handleMethodReset}
          />
      </Segment>
      </div>
    );
    return display;
  }
}
