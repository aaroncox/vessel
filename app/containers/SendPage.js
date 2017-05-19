// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Header, Segment } from 'semantic-ui-react';

import * as AccountActions from '../actions/account';
import * as KeysActions from '../actions/keys';
import * as ProcessingActions from '../actions/processing';
import Send from '../components/Send';
import MenuBar from './MenuBar';
import ContentBar from '../components/ContentBar';

class SendPage extends Component {

  state = {
    intervalId: 0
  };

  componentDidMount() {
    // this.interval = setInterval(this.timer.bind(this), 10000);
    // this.props.actions.refreshAccountData(this.props.keys.names);
  }
  componentWillUnmount() { clearInterval(this.interval); }
  timer = () => { this.props.actions.refreshAccountData(this.props.keys.names); }

  interval = 0;


  render() {
    if (!this.props.keys.isUser) {
      return <Redirect to="/" />;
    }
    return (
      <ContentBar>
        <Segment attached secondary padded>
          <Header
            icon="send"
            content="Send Funds"
            subheader="Transfer STEEM or SBD from one of your accounts to another user or exchange."
          />
        </Segment>
        <Segment basic>
          <Send {...this.props} />
        </Segment>
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
    processing: state.processing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...KeysActions,
      ...ProcessingActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendPage);
