// @flow
import type { preferencesStateType } from '../reducers/preferences';

export const SET_PREFERENCE = 'SET_PREFERECE';

export function setPreference(key: string, value: string) {
  return {
    type: SET_PREFERENCE,
    payload: {
      key,
      value
    }
  };
}
