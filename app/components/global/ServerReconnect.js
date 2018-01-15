// @flow
import React, { Component } from 'react';

import { Button } from 'semantic-ui-react';

export default class ServerReconnect extends Component {

  selectServer = (e, data) => {
    const { refreshGlobalProps } = this.props.actions;
    refreshGlobalProps()
  }

  render() {
    return (
      <Button floated="right" color="yellow" content="Reconnect"/>
    );
  }
}
