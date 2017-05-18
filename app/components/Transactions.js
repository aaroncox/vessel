// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Header, Segment, Statistic } from 'semantic-ui-react';
import Balances from './Transactions/Balances';
import PendingRewards from './Transactions/PendingRewards';
import RecentTransactions from './Transactions/RecentTransactions';

export default class Transactions extends Component {

  render() {
    const account = this.props.account;
    let pendingRewards = false;
    // if(account.reward_sbd_balance !== "0.000 SBD" || account.reward_vesting_balance !== "0.000000 VESTS") {
      pendingRewards = <PendingRewards {...this.props} />
    // }
    return (
      <div>
        <Segment color="blue" inverted attached data-tid="container">
          <Header textAlign="center">
            Account History
          </Header>
        </Segment>
        <Segment basic>
          {pendingRewards}
          <Segment>
            <Balances {...this.props} />
          </Segment>
        </Segment>
      </div>
    );
  }
}
