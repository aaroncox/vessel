// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Button, Header, Icon, Menu, Modal, Segment } from 'semantic-ui-react';

import Accounts from '../components/Accounts';
import AccountsDelegation from '../components/Accounts/Delegation';
import AccountsProxy from '../components/Accounts/Proxy';
import * as AccountActions from '../actions/account';
import * as KeyActions from '../actions/keys';
import MenuBar from './MenuBar';
import ContentBar from '../components/ContentBar';
import KeysAdd from '../components/Keys/Add';

class AccountsPage extends Component {

  state = {
    activeItem: 'keys',
    addAccount: false
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleAddAccount = () => {
    this.props.actions.addKeyPrompt();
  }

  handleAddAccountCancel = () => {
    this.props.actions.addKeyCancel();
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
          style="large"
          content={
            <Segment basic>
              <KeysAdd {...this.props} />
            </Segment>
          }
          onClose={this.handleAddAccountCancel}
        />
      );
    }
    let activeTab = <Accounts {...this.props} />;
    switch (activeItem) {
      case 'delegation': {
        activeTab = <AccountsDelegation {...this.props} />;
        break;
      }
      case 'proxy': {
        activeTab = <AccountsProxy {...this.props} />;
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
              content="Add another account"
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
            name="proxy"
            icon="sitemap"
            content="Witness Proxy"
            active={activeItem === 'proxy'}
            onClick={this.handleItemClick}
          />
          {/* <Menu.Item
            name='delegation'
            content="SP Delegation"
            active={activeItem === 'delegation'}
            onClick={this.handleItemClick}
          /> */}
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
    steem: state.steem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...KeyActions,
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage);
