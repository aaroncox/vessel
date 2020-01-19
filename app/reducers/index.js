// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { intlReducer } from 'react-intl-redux';
import { createBrowserHistory } from 'history';

import account from './account';
import keys from './keys';
import preferences from './preferences';
import processing from './processing';
import steem from './steem';


const rootReducer = combineReducers({
  account,
  keys,
  router: connectRouter(createBrowserHistory()),
  preferences,
  processing,
  steem,
  intl: intlReducer
});

export default rootReducer;
