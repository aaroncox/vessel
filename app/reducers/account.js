// @flow
import {
  ACCOUNT_DATA_UPDATE,
  ACCOUNT_DATA_WITHDRAW_ROUTES_UPDATE,
  ACCOUNT_GET_TRANSACTIONS_RESOLVED
} from '../actions/account';

const defaultState = {
  updated: false,
  accounts: {}
};

export type accountStateType = {
  updated: Date,
  accounts: any
};

type actionType = {
  type: string,
  payload: any
};

export default function account(state = defaultState, action: actionType) {
  // console.log('>>> reducers/account', state, action);
  switch (action.type) {
    case ACCOUNT_GET_TRANSACTIONS_RESOLVED:
      return Object.assign({}, state, {
        transactions: action.payload.transactions
      });
    case ACCOUNT_DATA_UPDATE: {
      const accounts = (state.accounts) ? state.accounts : {};
      const amended = Object.assign({}, accounts, action.payload);
      return Object.assign({}, state, {
        updated: new Date(),
        accounts: amended
      });
    }
    case ACCOUNT_DATA_WITHDRAW_ROUTES_UPDATE: {
      const withdrawRoutes = (state.withdrawRoutes) ? state.withdrawRoutes : {};
      const amended = Object.assign({}, withdrawRoutes, action.payload);
      return Object.assign({}, state, {
        withdrawRoutes: amended
      });
      return state;
    }
    default: {
      return state;
    }
  }
}
