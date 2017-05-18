// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import '../app.global.css';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
