// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Divider, Grid, Header, Segment, Statistic, Table } from 'semantic-ui-react';

export default class RecentTransactions extends Component {
  render() {
    const transactions = this.props.transactions;
    const header = (
      <Table.Row>
        <Table.Header>
          Test
        </Table.Header>
      </Table.Row>
    );
    const items = [];
    transactions.forEach((tx) => {
      items.push(
        <Table.Row>
          <Table.Cell>{tx.type}</Table.Cell>
          <Table.Cell>{tx.amount.sbd}</Table.Cell>
          <Table.Cell>{tx.amount.vest}</Table.Cell>
          <Table.Cell>{tx.amount.steem}</Table.Cell>
        </Table.Row>
      );
      console.log(tx);
    });
    // console.log(this.props)
    return (
      <Segment textAlign="left" attached>
        <Header>
          Recent Transactions
        </Header>
        <Table
          unstackable
          children={items}
          headerRow={header}
        />
      </Segment>
    );
  }
}
