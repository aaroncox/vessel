// @flow
import {
  ACCOUNT_DATA_MINIMUM_ACCOUNT_DELEGATION,
  ACCOUNT_DATA_UPDATE,
  ACCOUNT_DATA_WITHDRAW_ROUTES_UPDATE,
  ACCOUNT_DATA_VESTING_DELEGATIONS_UPDATE,
  ACCOUNT_GET_TRANSACTIONS_RESOLVED,
  ACCOUNT_CONTACTS_ADD,
  ACCOUNT_CONTACTS_REMOVE
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
    case ACCOUNT_CONTACTS_ADD: {
      let contacts = (state.contacts) ? state.contacts : [];
      if(contacts.indexOf(action.payload) < 0) contacts.push(action.payload);
      return Object.assign({}, state, { contacts });
    }
    case ACCOUNT_CONTACTS_REMOVE: {
      console.log(action.payload)
      let contacts = (state.contacts) ? state.contacts : [];
      contacts = contacts.filter((itm) => {return itm !== action.payload})
      return Object.assign({}, state, { contacts });
    }
    default: {
      return state;
    }
  }
}
