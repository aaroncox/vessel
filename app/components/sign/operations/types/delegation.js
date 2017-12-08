// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Accordion, Button, Card, Checkbox, Divider, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Message, Radio, Segment, Statistic, Select, TextArea } from 'semantic-ui-react'
import NumericLabel from '../../../../utils/NumericLabel';

export default class OperationsPromptDelegation extends Component {

  render() {
    const { opData } = this.props
    const { vesting_shares } = opData
    const vests = parseFloat(vesting_shares.split(" ")[0])
    const totalVestsSteem = parseFloat(this.props.steem.props.total_vesting_fund_steem.split(" ")[0])
    const totalVests = parseFloat(this.props.steem.props.total_vesting_shares.split(" ")[0])
    const sp = (vests > 0) ? (totalVestsSteem * vests / totalVests).toFixed(3) : 0
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    return (
      <Segment attached padded>
        <Grid>
          <Grid.Row columns={3} textAlign='center' verticalAlign='top'>
            <Grid.Column>
              <div style={{
                backgroundImage: `url(https://steemitimages.com/u/${opData.delegator || 'steemit'}/avatar/medium)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'inline-block',
                height: '96px',
                width: '96px',
              }} />
              <Header style={{margin: 0}}>
                {opData.delegator || '<sender>'}
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
              <div style={{
                backgroundImage: `url(https://steemitimages.com/u/${opData.delegatee || 'steemit'}/avatar/medium)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'inline-block',
                height: '96px',
                width: '96px',
              }} />
              <Header style={{margin: 0}}>
                {opData.delegatee}
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
        </Grid>
      </Segment>
    )
  }

}
