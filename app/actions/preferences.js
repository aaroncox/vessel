// @flow
import {updateIntl} from 'react-intl-redux';

import type { preferencesStateType } from '../reducers/preferences';

export const SET_PREFERENCE = 'SET_PREFERECE';

export function setPreference(key: string, value: string) {
  return (dispatch: () => void) => {
    if (key === 'locale') {
      dispatch(updateIntl({
        locale: value,
        messages: require('../locales/' + value + '.json'),
      }));
    }
    dispatch({
      type: SET_PREFERENCE,
      payload: {
        key,
        value
      }
    });
  };
}
