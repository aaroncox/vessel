// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Accordion, Button, Card, Checkbox, Divider, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Message, Radio, Segment, Statistic, Select, TextArea } from 'semantic-ui-react'
import NumericLabel from '../../../../utils/NumericLabel';

import AccountAvatar from '../../../global/AccountAvatar';
import AccountName from '../../../global/AccountName';


export default class OperationsPromptDelegation extends Component {

  render() {
    const { opData } = this.props
    const { vesting_shares } = opData
    const avatar_delegator = <AccountAvatar name={opData.delegator} />
    const avatar_delegatee = <AccountAvatar name={opData.delegatee} />
    const vests = parseFloat(vesting_shares.split(" ")[0])
    const totalVestsSteem = parseFloat(this.props.steem.props.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(this.props.steem.props.total_vesting_shares.split(" ")[0])
    const sp = (vests > 0) ? (totalVestsSteem * vests / totalVests).toFixed(3) : 0
    let existingDelegation = 0
    let existingDelegationWarning = false
    if (this.props.account.vestingDelegations && this.props.account.vestingDelegations[opData.delegator]) {
      const existingDelegations = this.props.account.vestingDelegations[opData.delegator]
      existingDelegation = existingDelegations.reduce((a, b) => (b.delegator === opData.delegator && b.delegatee === opData.delegatee) ? a + parseFloat(b.vesting_shares.split(" ")[0]) : 0, 0)
      if(existingDelegation > 0) {
        const existingSp = (totalVestsSteem * existingDelegation / totalVests).toFixed(3)
        existingDelegationWarning = (
          <Grid.Row columns={1}>
            <Grid.Column>
              <Message info>
                A delegation of <strong>{existingSp} SP</strong> ({existingDelegation} VESTS) is already active from <AccountName name={opData.delegator}/> to <AccountName name={opData.delegatee}/>. This new delegation will <strong>overwrite</strong> the existing delegation (not add to it).
              </Message>
            </Grid.Column>
          </Grid.Row>
        )
      }
    }
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    return (
      <Segment attached padded>
        <Grid>
          <Grid.Row columns={3} textAlign='center' verticalAlign='top'>
            <Grid.Column>
              {avatar_delegator}
              <Header style={{margin: 0}}>
                {(opData.delegator) ? <AccountName name={opData.delegator} /> : '<sender>'}
                {(
                  opData.amount
                  ? (
                    <Header.Subheader color='orange'>
                      -{opData.amount}
                    </Header.Subheader>
                  )
                  : false
                )}
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Header icon color='green' >
                <Icon name='arrow circle right' size='huge' style={{margin: '0.25em 0'}} />
                {sp} SP
                <Header.Subheader>
                  <NumericLabel params={numberFormat}>{vests}</NumericLabel>  VESTS
                </Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column>
              {avatar_delegatee}
              <Header style={{margin: 0}}>
                <AccountName name={opData.delegatee} />
                {(
                  opData.amount
                  ? (
                    <Header.Subheader color='green'>
                      +{opData.amount}
                    </Header.Subheader>
                  )
                  : false
                )}
              </Header>
            </Grid.Column>
          </Grid.Row>
          {existingDelegationWarning}
        </Grid>
      </Segment>
    )
  }

}
