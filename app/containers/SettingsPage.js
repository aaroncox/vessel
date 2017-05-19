// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Settings from '../components/Settings';
import MenuBar from './MenuBar';
import ContentBar from '../components/ContentBar';
import * as PreferencesActions from '../actions/preferences';
import { Header, Segment } from 'semantic-ui-react';

class SettingsPage extends Component {
  render() {
    if (!this.props.keys.isUser) {
      return <Redirect to="/" />;
    }
    return (
      <ContentBar>
        <Segment padded attached secondary>
          <Header
            icon="settings"
            content="Wallet Settings"
            subheader="Configuration for Vessel wallets."
          />
        </Segment>
        <Settings {...this.props} />
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
      ...PreferencesActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
