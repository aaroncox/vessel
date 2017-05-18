import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import { persistStore, autoRehydrate } from 'redux-persist'
import AppProvider from './app.js'

render(
  <AppProvider />,
  document.getElementById('root')
);
