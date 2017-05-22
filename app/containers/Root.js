// @flow
import React from 'react';
import { Provider } from 'react-intl-redux';
import { ConnectedRouter } from 'react-router-redux';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';

import Routes from '../routes';

addLocaleData([...en]);

type RootType = {
  store: {},
  history: {}
};

export default function Root({ store, history }: RootType) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
}
