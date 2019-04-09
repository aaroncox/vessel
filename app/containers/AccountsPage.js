// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Button, Header, Icon, Menu, Modal, Segment, Table } from 'semantic-ui-react';

import Accounts from '../components/Accounts';
import AccountsAuths from '../components/Accounts/Auths';
import AccountsDelegation from '../components/Accounts/Delegation';
import AccountsProxy from '../components/Accounts/Proxy';
import AccountsVoting from '../components/Accounts/Voting';
import * as AccountActions from '../actions/account';
import * as KeyActions from '../actions/keys';
import * as ProcessingActions from '../actions/processing';
import MenuBar from './MenuBar';
import ContentBar from '../components/ContentBar';
import KeysAdd from '../components/Keys/Add';
import KeysCreate from '../components/Keys/Create';
import KeysMemo from '../components/Keys/Memo';

class AccountsPage extends Component {

  state = {
    activeItem: 'keys',
    addAccount: false
  };

  constructor(props) {
    super(props);
    props.actions.getMinimumAccountDelegation(props.preferences);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleAddAccount = () => {
    this.props.actions.addKeyPrompt();
  }

  handleAddAccountCancel = () => {
    this.props.actions.addKeyCancel();
  }

  handleAddMemoKeyCancel = () => {
    this.props.actions.addMemoKeyCancel();
  }

  handleAddMemoKeyConfirmed = () => {
    this.props.actions.addMemoKeyConfirmed();
  }

  handleCreateAccount = () => {
    this.props.actions.createKeyPrompt();
  }

  handleCreateAccountCancel = () => {
    this.props.actions.createKeyCancel();
  }

  handleRemoveKeyCancel = () => {
    this.props.actions.removeKeyCancel();
  }

  handleRemoveKeyConfirmed = () => {
    this.props.actions.removeKeyConfirmed(this.props.keys.remove);
  }

  render() {
    if (!this.props.keys.isUser) {
      return <Redirect to="/" />;
    }
    const { activeItem } = this.state;
    let modal = false;
    if (this.props.keys.addPrompt) {
      modal = (
        <Modal
          open
          closeIcon="close"
          className="large"
          content={
            <Segment basic>
              <KeysAdd {...this.props} />
            </Segment>
          }
          onClose={this.handleAddAccountCancel}
        />
      );
    }
    if (this.props.keys.createPrompt) {
      modal = (
        <Modal
          open
          closeIcon="close"
          className="large"
          content={
            <Segment basic>
              <KeysCreate
                handleMethodReset={this.handleCreateAccountCancel}
                {...this.props}
              />
            </Segment>
          }
          onClose={this.handleCreateAccountCancel}
        />

      )
    }
    let activeTab = <Accounts {...this.props} />;
    switch (activeItem) {
      case 'auths': {
        activeTab = <AccountsAuths {...this.props} />;
        break;
      }
      case 'delegation': {
        activeTab = <AccountsDelegation {...this.props} />;
        break;
      }
      case 'proxy': {
        activeTab = <AccountsProxy {...this.props} />;
        break;
      }
      case 'voting': {
        activeTab = <AccountsVoting {...this.props} />;
        break;
      }
      default: {
        activeTab = <Accounts {...this.props} />;
        break;
      }
    }

    if (this.props.keys.remove) {
      modal = (
        <Modal
          open
          header="Remove this account?"
          content={
            <Segment padded basic>
              <p>
                Are you sure you want to remove this account? All keys associated
                to this account will be removed from the wallet. If you do not have
                backups, your account may be lost.
              </p>
              <Header>
                Account:
                {' '}
                {this.props.keys.remove}
              </Header>
            </Segment>
          }
          actions={[
            {
              key: 'no',
              content: 'No',
              color: 'red',
              onClick: this.handleRemoveKeyCancel
            },
            {
              key: 'yes',
              content: 'Yes',
              color: 'green',
              onClick: this.handleRemoveKeyConfirmed
            }
          ]}
        />
      );
    }
    if (this.props.keys.addMemoPrompt) {
      modal = (
        <Modal
          open
          header="Add a Memo Key"
          content={
            <KeysMemo
              actions={this.props.actions}
              keys={this.props.keys}
            />
          }
          actions={[
            {
              key: 'no',
              content: 'Cancel',
              color: 'red',
              onClick: this.handleAddMemoKeyCancel
            }
          ]}
        />
      );
    }
    return (
      <ContentBar>
        {modal}
        <Segment basic padded attached secondary>
          <Header>
            <Button
              color="green"
              onClick={this.handleAddAccount}
              icon="plus"
              floated="right"
              content="Add account"
            />
            <Icon name="users" />
            <Header.Content>
              Accounts
              <Header.Subheader>
                The accounts imported into this wallet and their permissions.
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Menu tabular attached>
          <Menu.Item
            name="keys"
            icon="lock"
            content="Account Keys"
            active={activeItem === 'keys'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="auths"
            icon="users"
            content="Account Auths"
            active={activeItem === 'auths'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="delegation"
            icon="tasks"
            content="SP Delegation"
            active={activeItem === 'delegation'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="proxy"
            icon="sitemap"
            content="Witness Proxy"
            active={activeItem === 'proxy'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="voting"
            icon="check"
            content="Witness Voting"
            active={activeItem === 'voting'}
            onClick={this.handleItemClick}
          />
        </Menu>
        {activeTab}
        <MenuBar />
      </ContentBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    keys: state.keys,
    processing: state.processing,
    preferences: state.preferences,
    steem: state.steem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...KeyActions,
      ...ProcessingActions,
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage);
