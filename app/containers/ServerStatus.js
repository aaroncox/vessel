/* eslint flowtype-errors/show-errors: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Header, Icon, Message } from 'semantic-ui-react';

import ServerSelect from '../components/global/ServerSelect'
import ServerReconnect from '../components/global/ServerReconnect'
import * as PreferencesActions from '../actions/preferences';
import * as SteemActions from '../actions/steem';

class ServerStatus extends Component {

  state = {
    now: Date.now()
  }

  componentDidMount() {
    this.interval = setInterval(this.currentTime.bind(this), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  currentTime = () => {
    this.setState({now: Date.now()})
  }

  render() {
    let message = false
    const lastUpdated = new Date(this.props.steem.props.time + 'Z').getTime();
    const now = this.state.now;
    if(((Date.now() - lastUpdated) / 1000) > 30) {
      message = (
        <Message attached='top' error color='red' size='big' style={{paddingLeft: '102px'}}>
          <Header textAlign='center'>
            <ServerSelect {...this.props} />
            <ServerReconnect {...this.props} />
            <Icon name='warning sign' />
            <Header.Content>
              Connection lost, attempting to reconnect...
            </Header.Content>
          </Header>
        </Message>
      )
    }
    return message;
  }
}

function mapStateToProps(state) {
  return {
    account: state.account
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...PreferencesActions,
      ...SteemActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerStatus);
