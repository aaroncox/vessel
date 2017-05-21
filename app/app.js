import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { persistStore, autoRehydrate } from 'redux-persist'

import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';

const store = configureStore();

export default class AppProvider extends React.Component {
  constructor() {
    super()
    this.state = { rehydrated: false }
  }

  componentWillMount() {
    const config = {
      whitelist: ['account', 'keys', 'preferences', 'steem']
    };
    persistStore(store, config, () => {
      this.setState({ rehydrated: true })
    });
  }

  render() {
    if (!this.state.rehydrated) {
      return <div>Loading...</div>;
    }
    if (module.hot) {
      module.hot.accept('./containers/Root', () => {
        const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
        return (
          <AppContainer>
            <NextRoot store={store} history={history} />
          </AppContainer>
        );
      });
    }
    return (
      <AppContainer>
        <Root store={store} history={history} />
      </AppContainer>
    );
  }
}
