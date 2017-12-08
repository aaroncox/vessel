// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';

import { Accordion, Button, Card, Checkbox, Divider, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Message, Radio, Segment, Statistic, Select, TextArea } from 'semantic-ui-react'

import AccountAvatar from '../../../global/AccountAvatar';
import AccountName from '../../../global/AccountName';
import PostLink from '../../../global/PostLink';

export default class OperationsPromptVote extends Component {

  render() {
    const { opData, prompts } = this.props
    const avatar_author = <AccountAvatar name={opData.author} />
    const avatar_voter = <AccountAvatar name={opData.voter} />
    return (
      <Segment attached padded>
        <Grid>
          <Grid.Row columns={3} textAlign='center' verticalAlign='top'>
            <Grid.Column>
              {avatar_voter}
              <Header style={{margin: 0}}>
                {(opData.voter) ? <AccountName name={opData.voter} /> : '<sender>'}
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Header icon color='green' >
                <Icon name='thumbs up' size='huge' style={{margin: '0.25em 0'}} />
                {(opData.weight/100).toFixed(2)}%
              </Header>
            </Grid.Column>
            <Grid.Column>
              {avatar_author}
              <Header style={{margin: 0}}>
                <AccountName name={opData.author} />
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Segment>
          <Header>
            Voting on:
            <Header.Subheader>
              <PostLink author={opData.author} permlink={opData.permlink} />
            </Header.Subheader>
          </Header>


        </Segment>

      </Segment>
    )
  }

}
