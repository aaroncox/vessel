// @flow
import steem from 'steem';

import React, { Component } from 'react';
import { Button, Divider, Form, Grid, Header, Input, Message, Modal, Segment, Table } from 'semantic-ui-react';
import InputRange from 'react-input-range';

import NumericLabel from '../../utils/NumericLabel';
import AccountName from '../global/AccountName';

export default class AccountsVoting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vests: 0,
      sp: 0,
      editVoteFor: false
    };
    this.props.actions.resetState = this.resetState.bind(this);
  }
  state = {
    vests: 0,
    sp: 0,
    editVoteFor: false
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_vote_witness_error) {
      this.setState({
        removeVoteError: nextProps.processing.account_vote_witness_error
      })
      nextProps.actions.voteWitnessCompleted();
    }
    if (nextProps.processing.account_vote_witness_resolved) {
      nextProps.actions.voteWitnessCompleted();
      this.resetState();
    }
  }
  resetState() {
    this.setState({
      editVoteFor: false,
      removeVoteError: false,
    });
  }
  handleCancel = () => {
    this.resetState();
  }
  handleVoteWitnessRemove = (e, props) => {
    let { account, witness } = props.value.witness;
    witness = witness.toLowerCase().replace('@', '');
    const permissions = this.props.keys.permissions;
    this.setState({removeVoteError: false})
    this.props.actions.useKey('voteWitness', { account, witness, approve: false }, permissions[account])
  }
  handleVoteWitness = (e, props) => {
    this.setState({
      editVoteFor: props.value
    })
  }
  handleVoteWitnessConfirm = (e, props) => {
    const { permissions } = this.props.keys;
    const account = this.state.editVoteFor;
    const witness = this.state[account];
    this.props.actions.useKey('voteWitness', { account, witness, approve: true }, permissions[account])
    e.preventDefault();
  }
  handleChangeVestingShares = (e, props) => {
    const editing = this.state.editVoteFor;
    const newState = {};
    newState[editing] = props.value.trim();
    this.setState(newState);
  }
  render() {
    const t = this;
    let addWitnessVote = false;
    let removeVoteError = false;
    if (this.state.removeVoteError) {
      removeVoteError = (
        <Message
          error
          header='Operation Error'
          content={this.state.removeVoteError}
        />
      )
    }
    const numberFormat = {
      wholenumber: 'floor',
      precision: 0
    };
    const {
      account_vote_witness_error,
      account_vote_witness_pending,
      account_vote_witness_resolved
    } = this.props.processing;
    if (this.state.editVoteFor) {
      const name = this.state.editVoteFor;
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
                  autoFocus
                  onChange={this.handleChangeVestingShares}
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
              value: this.state.editVoteFor,
              onClick: this.handleVoteWitnessConfirm,
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
                <Table size="small">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>
                        Witness
                      </Table.HeaderCell>
                      <Table.HeaderCell collapsing>
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
                        <Table.Cell>
                          <Button
                            color="orange"
                            size="small"
                            icon="trash"
                            value={{ witness }}
                            onClick={this.handleVoteWitnessRemove}
                          />
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                  </Table.Body>
                </Table>
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
        <Header>
          <Header.Subheader>
            Each account may vote for 30 witnesses at a time.
          </Header.Subheader>
        </Header>
        {removeVoteError}
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
