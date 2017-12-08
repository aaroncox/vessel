// @flow
import React, { Component } from 'react';

const { shell } = require('electron');

export default class PostLink extends Component {

  handleLink = () => {
    const { author, permlink } = this.props;
    shell.openExternal(`https://steemit.com/category/@${author}/${permlink}`);
  }

  render() {
    const { author, permlink } = this.props;
    return (
      <a
        onClick={this.handleLink}
        >
        {author}/{permlink}
      </a>
    );
  }
}
