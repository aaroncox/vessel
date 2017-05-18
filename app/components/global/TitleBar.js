// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Icon, Segment } from 'semantic-ui-react';

export default class TitleBar extends Component {
  render() {
    const { color, icon, title, handleClose } = this.props;
    if (!color) color = "blue";
    let closeButton = false;
    let titleIcon = false;
    if (handleClose) {
      closeButton = <Icon name="close" style={{ float: "right" }} onClick={handleClose} />
    }
    if (icon) {
      titleIcon = <Icon name={icon} size="small" style={{ float: "left" }} />
    }
    return (
      <Segment color={color} clearing inverted attached data-tid="container">
        {closeButton}
        <Header floated="left" icon={icon} content={title} />
      </Segment>
    );
  }
}
