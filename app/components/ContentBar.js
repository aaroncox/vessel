// @flow
import React, { Component } from 'react';
import type { Children } from 'react';

export default class ContentBar extends Component {
  props: {
    children: Children
  };
  render() {
    return (
      <div
        style={{
          marginLeft: '92px'
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
