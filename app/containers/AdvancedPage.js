// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Button, Header, Icon, Menu, Modal, Segment, Table } from 'semantic-ui-react';

import AccountsCustomJson from '../components/Accounts/CustomJSON.js';
import * as AccountActions from '../actions/account';
import * as KeyActions from '../actions/keys';
import * as ProcessingActions from '../actions/processing';
import MenuBar from './MenuBar';
import ContentBar from '../components/ContentBar';

class AccountsPage extends Component {

  state = {
    activeItem: 'custom_json'
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    if (!this.props.keys.isUser) {
      return <Redirect to="/" />;
    }
    const { activeItem } = this.state;
    let activeTab = <AccountsCustomJson {...this.props} />;
    switch (activeItem) {
      default: {
        activeTab = <AccountsCustomJson {...this.props} />;
        break;
      }
    }
    return (
      <ContentBar>
        <Segment basic padded attached secondary>
          <Header>
            <Icon name="lab" />
            <Header.Content>
              Advanced Operations
              <Header.Subheader>
                This section can be used to perform more advanced operations using the loaded accounts.
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Menu tabular attached>
          <Menu.Item
            name="custom_json"
            icon="lock"
            content="Custom JSON"
            active={activeItem === 'custom_json'}
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
