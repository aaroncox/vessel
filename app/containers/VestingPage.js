// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import MenuBar from './MenuBar';
import ContentBar from '../components/ContentBar';
import VestingAccounts from '../components/VestingAccounts';
import { Header, Segment, Divider, Icon } from 'semantic-ui-react';
import * as AccountActions from '../actions/account';
import * as KeysActions from '../actions/keys';


class VestingsPage extends Component {
  render() {
    if (!this.props.keys.isUser) {
      return <Redirect to="/" />;
    }
    return (
      <ContentBar>
        <Segment padded attached secondary>
          <Header>
            <Icon size="large" name="lightning" style={{display: 'inline-block'}} /><span>Vesting Schedule</span>
            <Divider />
            <Header.Subheader>Hive Power (aka SP aka VESTS) can be converted to liquid HIVE using a process called 'Powering Down' which takes 13 weeks to complete. During the 13 weeks, every 7 days, 1/13th of the amount choosen to withdraw will be credited to your account. You can interrupt this process at any time.</Header.Subheader>
            <br />
            <Header.Subheader>HIVE can be converted to vested SP using a process called 'Powering Up' which is instant. Powering up adds to user stake for allocating rewards and witness voting.</Header.Subheader>
          </Header>
        </Segment>
        <VestingAccounts {...this.props} />
        <MenuBar />
      </ContentBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    keys: state.keys,
    preferences: state.preferences,
    processing: state.processing,
    hive: state.hive
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...KeysActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VestingsPage);
