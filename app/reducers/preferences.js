// @flow
import {
  SET_PREFERENCE
} from '../actions/preferences';

const defaultState = {
  steemd_node: 'https://rpc.buildteam.io'
};

export type preferencesStateType = {};

type actionType = {
  type: string
};

export default function processing(state: any = defaultState, action: actionType) {
  // console.log('>>> reducers/preferences', state, action);
  switch (action.type) {
    case SET_PREFERENCE:
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      })
    default: {
      return state;
    }
  }
}
