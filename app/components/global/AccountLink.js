// @flow
import React, { Component } from 'react';

const { shell } = require('electron');

export default class AccountLink extends Component {

  handleLink = () => {
    const { name } = this.props;
    shell.openExternal(`https://hive.blog/@${name}`);
  }

  render() {
    const { name, content } = this.props;
    return (
      <a
        onClick={this.handleLink}
        >
        {content}
      </a>
    );
  }
}
