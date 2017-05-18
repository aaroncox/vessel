// @flow
import {
  STEEM_GLOBALPROPS_UPDATE,
  STEEM_GLOBALPROPS_UPDATE_RESOLVED
} from '../actions/steem';

type actionType = {
  type: string,
  payload: any
};

export default function account(state: any = {}, action: actionType) {
  // console.log('>>> reducers/account', state, action);
  switch (action.type) {
    case STEEM_GLOBALPROPS_UPDATE_RESOLVED:
      return Object.assign({}, state, {
        props: action.payload
      });
    default: {
      return state;
    }
  }
}
