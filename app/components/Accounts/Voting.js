// @flow
import steem from 'steem';

import React, { Component } from 'react';
import { Button, Divider, Form, Grid, Header, Input, Message, Modal, Segment, Table } from 'semantic-ui-react';
import InputRange from 'react-input-range';
import Collapsible from 'react-collapsible';

import NumericLabel from '../../utils/NumericLabel';
import AccountName from '../global/AccountName';

export default class AccountsVoting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addVoteFor: false,
      removeVoteFor: false,
      voteError: false,
    };
    this.props.actions.resetState = this.resetState.bind(this);
  }
  state = {
    addVoteFor: false,
    removeVoteFor: false
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_vote_witness_error) {
      this.setState({
        voteError: nextProps.processing.account_vote_witness_error
      })
      nextProps.actions.voteWitnessCompleted();
      this.resetState();
    }
    if (nextProps.processing.account_vote_witness_resolved) {
      nextProps.actions.voteWitnessCompleted();
      this.resetState();
    }
  }
  resetState() {
    this.setState({
      addVoteFor: false,
      removeVoteFor: false,
    });
  }
  handleCancel = () => {
    this.resetState();
  }
  handleVoteWitness = (e, props) => {
    this.setState({
      addVoteFor: props.value
    })
  }
  handleVoteWitnessConfirm = (e, props) => {
    const { permissions } = this.props.keys;
    const account = this.state.addVoteFor;
    const witness = this.state[account];
    this.props.actions.useKey('voteWitness', { account, witness, approve: true }, permissions[account])
    e.preventDefault();
  }
  handleVoteWitnessRemove = (e, props) => {
    this.setState({
      removeVoteFor: props.value
    })
  }
  handleVoteWitnessRemoveConfirm = (e, props) => {
    const { permissions } = this.props.keys;
    const { account, witness } = props.value;
    this.props.actions.useKey('voteWitness', { account, witness, approve: false }, permissions[account])
    e.preventDefault();
  }
  getWitnessesByVote = (e, props) => {
    let witnesses = [];
    steem.api.getWitnessesByVote("", 100, function(err,response){
      for (var i=0;i<response.length;i++) {
        witnesses.push({id: response[i]['owner'], label: response[i]['owner']});
      }
    });
    return witnesses;
  }
  handleSetWitness = (e, props) => {
    const editing = this.state.addVoteFor;
    const newState = {};
    newState[editing] = props.value.trim();
    this.setState(newState);
  }
  render() {
    let addWitnessVote = false;
    let voteError = false;
    let removeWitnessVote = false;
    if (this.state.voteError) {
      voteError = (
        <Message
          error
          header="Operation Error"
          content={this.state.voteError}
        />
      )
    }
    const {
      account_vote_witness_pending,
      account_vote_witness_resolved
    } = this.props.processing;
    if (this.state.addVoteFor) {
      const name = this.state.addVoteFor;
      const account = this.props.account.accounts[name];
      addWitnessVote = (
        <Modal
          size="small"
          open
          header="Vote for a STEEM Witness"
          content={
            <Form
              loading={account_vote_witness_pending}
            >
              <Segment
                padded
                basic
              >
                <p>
                  Please enter the name of the Witness you wish to vote for.
                </p>
                <Input
                  fluid
                  name="witness"
                  placeholder="Witness Account Name"
                  onChange= {this.handleSetWitness}
                  autoFocus
                />
                <Divider />
              </Segment>
            </Form>
          }
          actions={[
            {
              key: 'no',
              content: 'Cancel Operation',
              floated: 'left',
              color: 'red',
              onClick: this.handleCancel,
              disabled: account_vote_witness_pending
            },
            {
              key: 'yes',
              type: 'submit',
              content: 'Confirm Witness Vote',
              color: 'blue',
              value: this.state.addVoteFor,
              onClick: this.handleVoteWitnessConfirm,
              disabled: account_vote_witness_pending
            }
          ]}
        />
      );
    }
    if (this.state.removeVoteFor) {
      const name = this.state.removeVoteFor;
      const account = this.props.account.accounts[name];
      removeWitnessVote = (
        <Modal
          size="small"
          open
          header="Remove vote for a STEEM Witness"
          content={
            <Form
              loading={account_vote_witness_pending}
            >
              <Segment
                padded
                basic
              >
                <p>
                  Are you sure you wish to unvote <strong>{name['witness']}</strong>?
                </p>
              </Segment>
            </Form>
          }
          actions={[
            {
              key: 'no',
              content: 'Cancel Operation',
              floated: 'left',
              color: 'blue',
              onClick: this.handleCancel,
              disabled: account_vote_witness_pending
            },
            {
              key: 'yes',
              type: 'submit',
              content: 'Confirm Witness Unvote',
              color: 'red',
              value: this.state.removeVoteFor,
              onClick: this.handleVoteWitnessRemoveConfirm,
              disabled: account_vote_witness_pending
            }
          ]}
        />
      );
    }
    const names = this.props.keys.names;
    const accounts = names.map((name) => {
      const account = this.props.account.accounts[name];
      const witnesses = account.witness_votes || [];
      const hasActiveVotes = (witnesses && witnesses.length);
      const votesLeft = (30 - witnesses.length);
      return (
        <Table.Row key={name}>
          <Table.Cell>
            <Header size="small">
              <AccountName name={name} />
              <Header.Subheader>
                <strong>
                  {votesLeft}
                </strong> Votes Left
              </Header.Subheader>
            </Header>
          </Table.Cell>
          <Table.Cell>
            {(hasActiveVotes)
              ? (
                <Collapsible trigger="Votes Table ">
                <Divider/>
                  <Table size="small">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>
                            Witness
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          Remove
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {witnesses.map((witness) => {
                        return (
                          <Table.Row key={witness}>
                            <Table.Cell>
                                <AccountName name={witness} />
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ width: 75 }}>
                              <Button
                                icon="trash"
                                color="orange"
                                onClick={this.handleVoteWitnessRemove}
                                value={{account: name, witness: witness}}
                              />
                            </Table.Cell>
                          </Table.Row>
                        )
                      })}
                    </Table.Body>
                  </Table>
                </Collapsible>
              )
              : 'No active witness votes'
            }
          </Table.Cell>
          <Table.Cell textAlign="center" style={{ width: 75 }}>
            <Button
              icon="plus"
              color="green"
              onClick={this.handleVoteWitness}
              value={name}
            />
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Segment basic padded>
        {addWitnessVote}
        {removeWitnessVote}
        <Header>
          <Header.Subheader>
            Each account may vote for 30 witnesses at a time.
          </Header.Subheader>
        </Header>
        {voteError}
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                Name
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Active Votes
              </Table.HeaderCell>
              <Table.HeaderCell>
                Controls
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {accounts}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}
