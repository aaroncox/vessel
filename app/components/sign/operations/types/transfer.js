// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Accordion, Button, Card, Checkbox, Divider, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Message, Radio, Segment, Statistic, Select, TextArea } from 'semantic-ui-react'

import AccountAvatar from '../../../global/AccountAvatar';
import AccountName from '../../../global/AccountName';

export default class OperationsPromptTransfer extends Component {

  render() {
    const { opData, prompts } = this.props
    const avatar_from = <AccountAvatar name={opData.from} />
    const avatar_to = <AccountAvatar name={opData.to} />
    return (
      <Segment attached padded>
        <Grid>
          <Grid.Row columns={3} textAlign='center' verticalAlign='top'>
            <Grid.Column>
              {avatar_from}
              <Header style={{margin: 0}}>
                {(opData.from) ? <AccountName name={opData.from} /> : '<sender>'}
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
                {opData.amount}
              </Header>
            </Grid.Column>
            <Grid.Column>
              {avatar_to}
              <Header style={{margin: 0}}>
                <AccountName name={opData.to} />
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
