// @flow
import React, { Component } from 'react';

import { Button, Checkbox, Divider, Form, Grid, Header, Icon, List, Message, Modal, Segment, Table } from 'semantic-ui-react';

const { shell } = require('electron');

export default class AccountName extends Component {

  handleLink = () => {
    const { name } = this.props;
    shell.openExternal(`https://steemit.com/@${name}`);
  }

  render() {
    const { name } = this.props;
    return (
      <a
        onClick={this.handleLink}
        >
        {name}
      </a>
    );
  }
}
