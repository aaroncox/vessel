// @flow
import {
  ACCOUNT_DATA_MINIMUM_ACCOUNT_DELEGATION,
  ACCOUNT_DATA_UPDATE,
  ACCOUNT_DATA_WITHDRAW_ROUTES_UPDATE,
  ACCOUNT_DATA_VESTING_DELEGATIONS_UPDATE,
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
    case ACCOUNT_DATA_MINIMUM_ACCOUNT_DELEGATION: {
      return Object.assign({}, state, {
        minimumDelegation: action.payload
      });
    }
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
    }
    case ACCOUNT_DATA_VESTING_DELEGATIONS_UPDATE: {
      const vestingDelegations = (state.vestingDelegations) ? state.vestingDelegations : {};
      const amended = Object.assign({}, vestingDelegations, action.payload);
      return Object.assign({}, state, {
        vestingDelegations: amended
      });
    }
    default: {
      return state;
    }
  }
}
