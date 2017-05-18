// @flow
import {
  PROCESSING_ACCOUNT_LOADING,
  PROCESSING_ACCOUNT_LOADING_COMPLETE,
  PROCESSING_REWARD_CLAIM,
  PROCESSING_REWARD_CLAIM_COMPLETE,
} from '../actions/processing';

import {
  ACCOUNT_TRANSFER_STARTED,
  ACCOUNT_TRANSFER_FAILED,
  ACCOUNT_TRANSFER_RESOLVED,
  ACCOUNT_DELEGATE_VESTING_SHARES_STARTED,
  ACCOUNT_DELEGATE_VESTING_SHARES_RESOLVED,
  ACCOUNT_DELEGATE_VESTING_SHARES_FAILED,
  ACCOUNT_DELEGATE_VESTING_SHARES_COMPLETED,
  ACCOUNT_SET_WITHDRAW_VESTING_ROUTE_STARTED,
  ACCOUNT_SET_WITHDRAW_VESTING_ROUTE_FAILED,
  ACCOUNT_SET_WITHDRAW_VESTING_ROUTE_RESOLVED,
  ACCOUNT_SET_WITHDRAW_VESTING_ROUTE_COMPLETED,
  ACCOUNT_SET_VOTING_PROXY_COMPLETED,
  ACCOUNT_SET_VOTING_PROXY_FAILED,
  ACCOUNT_SET_VOTING_PROXY_STARTED,
  ACCOUNT_SET_VOTING_PROXY_RESOLVED,
  ACCOUNT_VESTING_WITHDRAW_COMPLETED,
  ACCOUNT_VESTING_WITHDRAW_FAILED,
  ACCOUNT_VESTING_WITHDRAW_STARTED,
  ACCOUNT_VESTING_WITHDRAW_RESOLVED
} from '../actions/account';

const defaultState = {
  account_transfer_processing: false
};

export type processingStateType = {};

type actionType = {
  type: string
};

export default function processing(state: any = defaultState, action: actionType) {
  // console.log('>>> reducers/processing', state, action);
  switch (action.type) {
    case ACCOUNT_TRANSFER_STARTED:
      return Object.assign({}, state, {
        account_transfer_error: false,
        account_transfer_resolved: false,
        account_transfer_pending: true
      });
    case ACCOUNT_TRANSFER_FAILED:
      return Object.assign({}, state, {
        account_transfer_error: setError(action.payload),
        account_transfer_resolved: false,
        account_transfer_pending: false
      });
    case ACCOUNT_TRANSFER_RESOLVED:
      return Object.assign({}, state, {
        account_transfer_error: false,
        account_transfer_resolved: true,
        account_transfer_pending: false
      });
    case ACCOUNT_DELEGATE_VESTING_SHARES_STARTED:
      return Object.assign({}, state, {
        account_delegate_vesting_shares_resolved: false,
        account_delegate_vesting_shares_error: false,
        account_delegate_vesting_shares_pending: true,
      });
    case ACCOUNT_DELEGATE_VESTING_SHARES_FAILED:
      return Object.assign({}, state, {
        account_delegate_vesting_shares_resolved: false,
        account_delegate_vesting_shares_error: setError(action.payload),
        account_delegate_vesting_shares_pending: false,
      });
    case ACCOUNT_DELEGATE_VESTING_SHARES_RESOLVED:
      return Object.assign({}, state, {
        account_delegate_vesting_shares_resolved: true,
        account_delegate_vesting_shares_error: false,
        account_delegate_vesting_shares_pending: false,
      });
    case ACCOUNT_DELEGATE_VESTING_SHARES_COMPLETED:
      return Object.assign({}, state, {
        account_delegate_vesting_shares_resolved: false,
        account_delegate_vesting_shares_error: false,
        account_delegate_vesting_shares_pending: false,
      });
    case ACCOUNT_SET_WITHDRAW_VESTING_ROUTE_STARTED:
      return Object.assign({}, state, {
        account_set_withdraw_vesting_route_resolved: false,
        account_set_withdraw_vesting_route_error: false,
        account_set_withdraw_vesting_route_pending: true,
      });
    case ACCOUNT_SET_WITHDRAW_VESTING_ROUTE_FAILED:
      return Object.assign({}, state, {
        account_set_withdraw_vesting_route_resolved: false,
        account_set_withdraw_vesting_route_error: setError(action.payload),
        account_set_withdraw_vesting_route_pending: false,
      });
    case ACCOUNT_SET_WITHDRAW_VESTING_ROUTE_RESOLVED:
      return Object.assign({}, state, {
        account_set_withdraw_vesting_route_resolved: true,
        account_set_withdraw_vesting_route_error: false,
        account_set_withdraw_vesting_route_pending: false,
      });
    case ACCOUNT_SET_WITHDRAW_VESTING_ROUTE_COMPLETED:
      return Object.assign({}, state, {
        account_set_withdraw_vesting_route_resolved: false,
        account_set_withdraw_vesting_route_error: false,
        account_set_withdraw_vesting_route_pending: false,
      });
    case ACCOUNT_SET_VOTING_PROXY_STARTED:
      return Object.assign({}, state, {
        account_set_voting_proxy_resolved: false,
        account_set_voting_proxy_error: false,
        account_set_voting_proxy_pending: true,
      });
    case ACCOUNT_SET_VOTING_PROXY_FAILED:
      return Object.assign({}, state, {
        account_set_voting_proxy_resolved: false,
        account_set_voting_proxy_error: setError(action.payload),
        account_set_voting_proxy_pending: false,
      });
    case ACCOUNT_SET_VOTING_PROXY_RESOLVED:
      return Object.assign({}, state, {
        account_set_voting_proxy_resolved: true,
        account_set_voting_proxy_error: false,
        account_set_voting_proxy_pending: false,
      });
    case ACCOUNT_SET_VOTING_PROXY_COMPLETED:
      return Object.assign({}, state, {
        account_set_voting_proxy_resolved: false,
        account_set_voting_proxy_error: false,
        account_set_voting_proxy_pending: false,
      });
    case ACCOUNT_VESTING_WITHDRAW_STARTED:
      return Object.assign({}, state, {
        account_vesting_withdraw_resolved: false,
        account_vesting_withdraw_error: false,
        account_vesting_withdraw_pending: true,
      });
    case ACCOUNT_VESTING_WITHDRAW_FAILED:
      return Object.assign({}, state, {
        account_vesting_withdraw_resolved: false,
        account_vesting_withdraw_error: true,
        account_vesting_withdraw_pending: false,
      });
    case ACCOUNT_VESTING_WITHDRAW_RESOLVED:
      return Object.assign({}, state, {
        account_vesting_withdraw_resolved: true,
        account_vesting_withdraw_error: false,
        account_vesting_withdraw_pending: false,
      });
    case ACCOUNT_VESTING_WITHDRAW_COMPLETED:
      return Object.assign({}, state, {
        account_vesting_withdraw_resolved: false,
        account_vesting_withdraw_error: false,
        account_vesting_withdraw_pending: false,
      });
    case PROCESSING_ACCOUNT_LOADING:
      return Object.assign({}, state, {
        account_loading: true
      });
    case PROCESSING_ACCOUNT_LOADING_COMPLETE: {
      return Object.assign({}, state, {
        account_loading: false
      });
    }
    case PROCESSING_REWARD_CLAIM:
      return Object.assign({}, state, {
        reward_claim: true
      });
    case PROCESSING_REWARD_CLAIM_COMPLETE: {
      return Object.assign({}, state, {
        reward_claim: false
      });
    }
    default: {
      return state;
    }
  }
}

function setError(response) {
  return response.payload.error.data.stack[0].format
}
