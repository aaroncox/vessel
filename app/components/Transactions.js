// @flow
import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import Balances from './Transactions/Balances';
import PendingRewards from './Transactions/PendingRewards';

export default class Transactions extends Component {

  render() {
    const pendingRewards = <PendingRewards {...this.props} />;
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
