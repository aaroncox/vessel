// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { intlReducer } from 'react-intl-redux';

import account from './account';
import keys from './keys';
import preferences from './preferences';
import processing from './processing';
import steem from './steem';


const rootReducer = combineReducers({
  account,
  keys,
  router,
  preferences,
  processing,
  steem,
  intl: intlReducer
});

export default rootReducer;
