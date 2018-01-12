// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Welcome from '../components/Welcome';
import * as KeyActions from '../actions/keys';
import * as PreferencesActions from '../actions/preferences';


class WelcomePage extends Component {

  render() {
    return (
      <div>
        <Welcome
          {... this.props}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account,
    keys: state.keys,
    processing: state.processing,
    preferences: state.preferences
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...KeyActions,
      ...PreferencesActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
