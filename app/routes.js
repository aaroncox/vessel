/* eslint flowtype-errors/show-errors: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import steem from 'steem';

import App from './containers/App';
import AdvancedPage from './containers/AdvancedPage';
import AccountsPage from './containers/AccountsPage';
import DebugPage from './containers/DebugPage';
import PromptOperation from './containers/PromptOperation';
import SettingsPage from './containers/SettingsPage';
import SendPage from './containers/SendPage';
import TransactionsPage from './containers/TransactionsPage';
import WelcomePage from './containers/WelcomePage';
import VestingPage from './containers/VestingPage';
import DecryptPrompt from './containers/DecryptPrompt';
import ServerStatus from './containers/ServerStatus';

import * as SteemActions from './actions/steem';

// steem.config.set('websocket', 'wss://api.steemit.com')
// // steem.api.getAccountHistory('jesta', -1, 1000, function(err, result) {
// //   console.log(err, result);
// // });

class Routes extends Component {

  isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
  }

  changeNode(url) {
    if (url && this.isURL(url)) {
      // If it's a valid URL, set
      steem.api.setWebSocket(url);
    } else {
      // Otherwise set to the rpc.buildteam.io node
      steem.api.setWebSocket('https://anyx.io');
    }
    // Force a refresh immediately after change
    this.props.actions.refreshGlobalProps();
  }

  componentWillMount() {
    if (this.props.preferences && this.props.preferences.steemd_node) {
      this.changeNode(this.props.preferences.steemd_node)
    }
  }
  componentWillReceiveProps(nextProps) {
    const nextNode = nextProps.preferences.steemd_node
    const thisNode = this.props.preferences.steemd_node
    if (nextNode !== thisNode) {
      this.changeNode(nextNode)
    }
  }
  render() {
    var parse = require('url-parse');
    const parsed = parse(window.location.href, true)
    if (parsed && parsed.query && parsed.query.action && parsed.query.action === 'promptOperation') {
      return (
        <App>
          <DecryptPrompt />
          <PromptOperation query={parsed.query} />
        </App>
      )
    }
    return (
      <App>
        <ServerStatus {...this.props} />
        <DecryptPrompt />
        <Switch>
          <Route
            exact
            path="/"
            render={
              (props) => {
                if(this.props.keys.isUser) {
                  return <TransactionsPage />;
                } else {
                  return <WelcomePage />;
                }
              }
            }
          />
          <Route path="/transactions" component={TransactionsPage} />
          <Route path="/debug" component={DebugPage} />
          <Route path="/send" component={SendPage} />
          <Route path="/vesting" component={VestingPage} />
          <Route path="/accounts" component={AccountsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/advanced" component={AdvancedPage} />
        </Switch>
      </App>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    keys: state.keys,
    location: state.location,
    preferences: state.preferences,
    router: state.router,
    steem: state.steem,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...SteemActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
