// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Accordion, Button, Card, Checkbox, Divider, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Message, Radio, Segment, Statistic, Select, TextArea } from 'semantic-ui-react'

export default class OperationsPromptTransfer extends Component {

  render() {
    const { opData, prompts } = this.props
    return (
      <Segment attached padded>
        <Grid>
          <Grid.Row columns={3} textAlign='center' verticalAlign='top'>
            <Grid.Column>
              <div style={{
                backgroundImage: `url(https://steemitimages.com/u/${opData.from || 'steemit'}/avatar/medium)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'inline-block',
                height: '96px',
                width: '96px',
              }} />
              <Header style={{margin: 0}}>
                {opData.from || '<sender>'}
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
              <div style={{
                backgroundImage: `url(https://steemitimages.com/u/${opData.to || 'steemit'}/avatar/medium)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'inline-block',
                height: '96px',
                width: '96px',
              }} />
              <Header style={{margin: 0}}>
                {opData.to}
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
