// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Button, Table } from 'semantic-ui-react';

import MenuBar from './MenuBar';
import ContentBar from '../components/ContentBar';

import * as PreferencesActions from '../actions/preferences';
import * as KeysActions from '../actions/keys';

class DebugPage extends Component {
  unlock = (e, props) => {
    console.log("unlock", props.value);
  }
  send = (e, props) => {
    // const wif = this.props.actions.getKey(props.value);
    const account = props.value;
    const { permissions } = this.props.keys;
    this.props.actions.useKey('transfer', {
      from: 'webdev',
      to: 'webdev',
      amount: '0.001 STEEM',
      memo: ''
    }, permissions[account])
    // this.props.actions.transfer(wif, "webdev", "webdev", "0.001 STEEM", "")
  }
  render() {
    console.log("props", this.props.keys.permissions['webdev']);
    const accounts = Object.keys(this.props.keys.permissions);
    const permissions = this.props.keys.permissions;
    if (!this.props.keys.isUser) {
      return <Redirect to="/" />;
    }
    return (
      <ContentBar>
        <Table celled unstackable attached>
          <Table.Body>
            {accounts.map((account, i) => (
                <Table.Row key={account}>
                  <Table.Cell>
                    {account}
                  </Table.Cell>
                  <Table.Cell>
                    {/* <Button
                      content="Unlock"
                      value={account}
                      onClick={this.unlock}
                    /> */}
                    <Button
                      content="Send"
                      value={account}
                      onClick={this.send}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {(permissions[account].encrypted) ? 'True' : 'False'}
                  </Table.Cell>
                  <Table.Cell>
                    {permissions[account].type}
                  </Table.Cell>
                  <Table.Cell>
                    {permissions[account].key}
                  </Table.Cell>
                </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <MenuBar />
      </ContentBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    keys: state.keys,
    preferences: state.preferences
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...KeysActions,
      ...PreferencesActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DebugPage);
