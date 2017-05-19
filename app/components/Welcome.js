// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Grid, Header, Segment } from 'semantic-ui-react';

import KeysImport from './Keys/Import';

const logo = require('../img/steem.png');
const { shell } = require('electron');

export default class Welcome extends Component {

  handleAuthorLink = () => {
    shell.openExternal('https://steemit.com/@jesta');
  }

  render() {
    if (this.props.keys.isUser) {
      return <Redirect to="/transactions" />;
    }
    return (
      <Grid divided stretched>
        <Grid.Row centered>
          <Grid.Column width={4} stretched>
            <Segment basic textAlign="center">
              <img
                alt="logo"
                className="ui tiny image"
                src={logo}
                style={{
                  margin: '2em auto 1em',
                }}
              />
              <Header size="large">
                Vessel
                <Header.Subheader>
                  <p>
                    Desktop wallet for the Steem Blockchain
                  </p>
                  <p>
                    Created by
                    {' '}
                    <a onClick={this.handleAuthorLink}>
                      jesta
                    </a>
                  </p>
                </Header.Subheader>
              </Header>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            <Segment basic padded>
              <Segment piled padded>
                <KeysImport {...this.props} />
              </Segment>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
