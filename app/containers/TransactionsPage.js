// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Transactions from '../components/Transactions';
import * as AccountActions from '../actions/account';
import * as ProcessingActions from '../actions/processing';
import * as KeysActions from '../actions/keys';
import * as SteemActions from '../actions/steem';
import MenuBar from './MenuBar';
import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';
import Balances from '../components/Transactions/Balances';
import PendingRewards from '../components/Transactions/PendingRewards';
import RecentTransactions from '../components/Transactions/RecentTransactions';
import ContentBar from '../components/ContentBar';

class TransactionsPage extends Component {

  render() {
    let account_data = (
      <Dimmer inverted active style={{minHeight: '100px', display: 'block'}}>
        <Loader size='large' content='Loading'/>
      </Dimmer>
    )
    if (!this.props.keys.isUser) {
      return <Redirect to="/" />;
    } else {
      account_data = (
        <Segment basic attached>
          <PendingRewards {...this.props} />
          <Balances {...this.props} />
        </Segment>
      )
    }
    return (
      <ContentBar>
        <Segment padded attached secondary>
          <Header
            icon="lightning"
            content="Account Balances"
            subheader="The total balance of all accounts and the individual balances of each account."
          />
        </Segment>
        {account_data}
        <MenuBar />
      </ContentBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    account_data: state.account_data,
    keys: state.keys,
    processing: state.processing,
    steem: state.steem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...KeysActions,
      ...ProcessingActions,
      ...SteemActions,
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage);
