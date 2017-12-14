// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Accordion, Button, Card, Checkbox, Divider, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Message, Radio, Segment, Statistic, Select, TextArea } from 'semantic-ui-react'

import OperationsPromptFieldAsset from './fields/asset'
import OperationsPromptFieldPercent from './fields/percent'
import OperationsPromptFieldVests from './fields/vests'

import OperationsPromptDelegation from './types/delegation'
import OperationsPromptTransfer from './types/transfer'
import OperationsPromptVote from './types/vote'

const opData = {}

// Templates for Operation Messaging
// Colors indicate level of risk - green, yellow, orange, red
const opTemplates = {
  account_create: {
    color: 'orange',
    message: () => 'Create new account (Review JSON for info).'
  },
  account_create_with_delegation: {
    color: 'orange',
    message: () => 'Create new account (Review JSON for info).'
  },
  account_update: {
    color: 'red',
    message: () => 'Update account info + keys (Review JSON for info).'
  },
  account_witness_vote: {
    color: 'orange',
    message: (op) => `Voting ${op.witness} for witness.`
  },
  account_witness_proxy: {
    color: 'orange',
    message: (op) => `Set ${op.proxy} as witness voting proxy.`
  },
  cancel_transfer_from_savings: {
    color: 'orange',
    message: (op) => `Cancel savings withdraw ${op.request_id} from ${op.from}.`
  },
  claim_reward_balance: {
    color: 'green',
    message: () => 'Claim pending reward balance.'
  },
  comment: {
    color: 'green',
    message: () => 'Creating a post (Review JSON for info).'
  },
  custom_json: {
    color: 'green',
    message: () => 'Custom Operation - Review JSON for more information.'
  },
  convert: {
    color: 'orange',
    message: (op) => `Convert ${op.amount} to equiv Steem (5 day wait).`
  },
  delegate_vesting_shares: {
    color: 'orange',
    message: (op) => `Delegate ${op.delegatee} ${op.vesting_shares}.`
  },
  feed_publish: {
    color: 'green',
    message: (op) => `Publish price feed of ${op.exchange_rate}.`
  },
  set_withdraw_vesting_route: {
    color: 'orange',
    message: (op) => `Set power down route to ${op.to_account} @ ${(op.percent / 100).toFixed(2)}%.`
  },
  transfer: {
    color: 'red',
    message: (op) => `Send ${op.to} ${op.amount}.`
  },
  transfer_from_savings: {
    color: 'orange',
    message: (op) => `Withdraw ${op.amount} from ${op.from}'s savings account to ${op.to}'s account.`
  },
  transfer_to_savings: {
    color: 'red',
    message: (op) => `Send ${op.amount} from ${op.from}'s account to ${op.to}'s savings account.`
  },
  transfer_to_vesting: {
    color: 'red',
    message: (op) => `Send ${op.to} ${op.amount} as Steem Power.`
  },
  vote: {
    color: 'green',
    message: (op) => `${(op.weight / 100).toFixed(2)}% vote for ${op.author}.`
  },
  withdraw_vesting: {
    color: 'orange',
    message: (op) => `Power down ${op.vesting_shares} from account ${op.account}.`
  },
  witness_update: {
    color: 'green',
    message: (op) => `Witness info update for ${op.owner}.`
  }
};

export default class OperationsPrompt extends Component {

  constructor(props) {
    super(props)
    const op = props.ops[0]
    const opData = op[1]
    this.state = {
      account: null,
      displayRawJSON: false,
      key: null,
      prompts: this.getPromptsFromMeta(props),
    }
  }

  getPromptsFromMeta = (props) => {
    return Object.keys(props.meta).map((field) => {
      const meta = props.meta[field]
      if(meta.prompt) {
        switch(meta.type) {
          case "asset":
          case "sbd":
          case "steem":
            return (
              <OperationsPromptFieldAsset
                field={field}
                key={field}
                meta={meta}
                modifyOpsPrompt={this.props.modifyOpsPrompt}
                opData={opData}
              />
            )
            break;
          case "percent":
            return (
              <OperationsPromptFieldPercent
                field={field}
                key={field}
                meta={meta}
                modifyOpsPrompt={this.props.modifyOpsPrompt}
                opData={opData}
              />
            )
          case "vests":
            return (
              <OperationsPromptFieldVests
                field={field}
                key={field}
                meta={meta}
                modifyOpsPrompt={this.props.modifyOpsPrompt}
                opData={opData}
                steem={this.props.steem}
              />
            )
            break;
          default:
            return (
              <Form.Field
                key={field}
                required={meta.required || false}
                control={Input}
                label={meta.label || field}
                index={0}
                name={field}
                onChange={this.props.modifyOpsPrompt}
              />
            )
        }
      }
    })
  }

  setAccount = (e, { value }) => {
    this.setState({account: value})
    this.props.accountChange(value)
  }

  createOpListItem = (op, idx) => {
    const opType = op[0]
    const opData = op[1]
    const opTemplate = opTemplates[opType]
    if(!opTemplate) {
      return (
        <Segment key={idx} attached>
          <Label color='red' style={{marginRight: '1em'}}>{op[0]}</Label>
          Review this operation via the JSON.
        </Segment>
      )
    }
    return (
      <Segment key={idx} attached>
        <Label color={opTemplate['color']} style={{marginRight: '1em'}}>{op[0]}</Label>
        {opTemplate.message(opData)}
      </Segment>
    )
  }

  listOps = (ops) => {
    if(ops.length === 1) {
      const op = this.props.ops[0]
      const opData = op[1]
      switch(ops[0][0]) {
        case 'delegate_vesting_shares':
          return [
            <Header attached='top' key='op-header'><Icon name='power' />Delegate Steem Power</Header>,
            <OperationsPromptDelegation account={this.props.account} opData={opData} steem={this.props.steem} />
          ]
        case 'transfer':
          return [
            <Header attached='top' key='op-header'><Icon name='money' />Transfer Funds</Header>,
            <OperationsPromptTransfer opData={opData} />
          ]
        case 'vote':
          return [
            <Header attached='top' key='op-header'><Icon name='thumbs up' />Vote on a Post</Header>,
            <OperationsPromptVote opData={opData} steem={this.props.steem} />
          ]
      }
    }
    return [
      (
        <Header attached='top' key='op-header'>
          Actions/Operations
        </Header>
      ),
      ops.map(this.createOpListItem)
    ]
  }

  handleClick = () => {
    this.setState({ displayRawJSON: !this.state.displayRawJSON })
  }

  render() {
    const { value } = this.state
    const { ops } = this.props
    const accounts = this.props.accounts.map((account) => {
      return {
        key: account,
        text: account,
        value: account
      }
    })
    const {
      account_custom_ops_error,
      account_custom_ops_resolved,
      account_custom_ops_pending
    } = this.props.processing
    const keys = []
    return (
      <Form
        error={account_custom_ops_error}
        loading={account_custom_ops_pending}
        size='large'
        onSubmit={this.props.submitOps}
      >
        <Segment attached='top' color='blue' inverted>
          <Header size='large'>
            Sign Transaction ({ops.length} operations)
          </Header>
        </Segment>
        <Segment attached secondary>
          <Segment.Group>
            {this.listOps(ops)}
            {(this.state.prompts.length > 0)
              ? (
                <Segment attached>
                  {this.state.prompts}
                </Segment>
              )
              : false
            }
            <Segment attached>
              <Form.Field
                control={Select}
                label='Signing Account'
                options={accounts}
                onChange={this.setAccount}
                placeholder='The account to sign this transaction.'
              />
            </Segment>
            <Segment attached='bottom'>
              <Accordion>
                <Accordion.Title active={this.state.displayRawJSON === true} index={0} onClick={this.handleClick}>
                  <Header style={{margin: 0}}>
                    <Header.Content style={{padding: 0}}>
                      <Icon name='dropdown' />
                      Transaction JSON
                    </Header.Content>
                  </Header>
                </Accordion.Title>
                <Accordion.Content active={this.state.displayRawJSON === true}>
                  <Segment padded secondary><pre>{JSON.stringify(ops, null, 2) }</pre></Segment>
                </Accordion.Content>
              </Accordion>
            </Segment>
          </Segment.Group>
          <Message
            color='yellow'
            icon='warning sign'
            header='Please review this transaction'
            content='Once signed and broadcast - this transaction cannot be reversed. Please review what types of operations you are about to perform and confirm the values.'
          />
          <Message
            error
            header='Operation Error'
            content={account_custom_ops_error}
          />
          <Form.Field
            disabled={!this.state.account}
            fluid
            primary
            control={Button}
          >
            Sign + Broadcast
          </Form.Field>
        </Segment>
      </Form>
    );
  }

}
