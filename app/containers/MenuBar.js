// @flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as AccountActions from '../actions/account';
import * as SteemActions from '../actions/steem';

const src = require('../img/steem.png');

class MenuBar extends Component {

  state = {
    intervalId: 0
  };

  componentDidMount() {
    // console.log('didmount', this.props);
    this.interval = setInterval(this.timer.bind(this), 10000);
    this.timer();
    // this.props.actions.getTransactions(this.props.keys.names);
  }

  componentWillUnmount() {
    // console.log('unmounting');
    clearInterval(this.interval);
  }

  interval = 0;

  timer = () => {
    this.props.actions.refreshAccountData(this.props.keys.names);
    this.props.actions.refreshGlobalProps();
    // this.props.actions.getTransactions(this.props.account.names);
  }

  render() {
    let height = 'Loading'
    if (this.props.steem.props) {
      height = this.props.steem.props.head_block_number;
    }
    return (
      <Menu
        style={{ maxWidth: '92px', overflow: 'hidden'}}
        vertical
        fixed="left"
        color="blue"
        inverted
        icon="labeled">
        <Menu.Item header>
          <img
            alt="Vessel"
            className="ui tiny image"
            src={src}
            style={{
              width: '50px',
              height: '50px',
              margin: '0 auto 1em',
            }}
          />
          <FormattedMessage
            id="global.name"
            defaultMessage="Vessel"
            description="The name of the app (vessel)"
          />
        </Menu.Item>
        <Link className="link item" to="/transactions">
          <Icon name="dashboard" />
          <FormattedMessage
            id="menu.overview"
            defaultMessage="Overview"
            description="The menu item for the section for the Wallet Overview"
          />
        </Link>
        <Link className="link item" to="/send">
          <Icon name="send" />
          <FormattedMessage
            id="menu.send"
            defaultMessage="Send"
            description="The menu item for the section for Sending or Transfering funds"
          />
        </Link>
        <Link className="link item" to="/vesting">
          <Icon name="lightning" />
          <FormattedMessage
            id="menu.vesting"
            defaultMessage="Vesting"
            description="The menu item for the section for managing Vesting Funds, powering up or powering down."
          />
        </Link>
        <Link className="link item" to="/accounts">
          <Icon name="users" />
          <FormattedMessage
            id="menu.accounts"
            defaultMessage="Accounts"
            description="The menu item for the section for managing accounts and keys."
          />
        </Link>
        <Link className="link item" to="/settings">
          <Icon name="settings" />
          <FormattedMessage
            id="menu.settings"
            defaultMessage="Settings"
            description="The menu item for the section for wallet settings"
          />
        </Link>
        <Menu.Item
          className="link"
          style={{
            position: 'absolute',
            bottom: 0
          }}
        >
          <p>
            <FormattedMessage
              id="global.height"
              defaultMessage="Height"
              description="A label for the current height of the blockchain"
            />
          </p>
          {height}
        </Menu.Item>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    keys: state.keys,
    steem: state.steem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...SteemActions
    }, dispatch)
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MenuBar));
