// @flow
import React, { Component } from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';

export default class TitleBar extends Component {
  render() {
    const { icon, title, handleClose } = this.props;
    let { color } = this.props;
    if (!color) color = "blue";
    let closeButton = false;
    if (handleClose) {
      closeButton = <Icon name="close" style={{ float: 'right' }} onClick={handleClose} />
    }
    return (
      <Segment color={color} clearing inverted attached data-tid="container">
        {closeButton}
        <Header floated="left" icon={icon} content={title} />
      </Segment>
    );
  }
}
