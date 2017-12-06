// @flow
import {
  PROCESSING_ACCOUNT_CREATE,
  PROCESSING_ACCOUNT_CREATE_CANCEL,
  PROCESSING_ACCOUNT_CREATE_COMPLETE,
  PROCESSING_ACCOUNT_CREATE_FAILED,
  PROCESSING_ACCOUNT_LOADING,
  PROCESSING_ACCOUNT_LOADING_COMPLETE,
  PROCESSING_REWARD_CLAIM,
  PROCESSING_REWARD_CLAIM_COMPLETE,
} from '../actions/processing';

import {
  ACCOUNT_CUSTOM_JSON_STARTED,
  ACCOUNT_CUSTOM_JSON_RESOLVED,
  ACCOUNT_CUSTOM_JSON_FAILED,
  ACCOUNT_CUSTOM_JSON_COMPLETED,
  ACCOUNT_CUSTOM_OPS_STARTED,
  ACCOUNT_CUSTOM_OPS_RESOLVED,
  ACCOUNT_CUSTOM_OPS_FAILED,
  ACCOUNT_CUSTOM_OPS_COMPLETED,
  ACCOUNT_TRANSFER_STARTED,
  ACCOUNT_TRANSFER_FAILED,
  ACCOUNT_TRANSFER_RESOLVED,
  ACCOUNT_TRANSFER_COMPLETED,
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
  ACCOUNT_VOTE_WITNESS_COMPLETED,
  ACCOUNT_VOTE_WITNESS_FAILED,
  ACCOUNT_VOTE_WITNESS_STARTED,
  ACCOUNT_VOTE_WITNESS_RESOLVED,
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
    case PROCESSING_ACCOUNT_CREATE:
      return Object.assign({}, state, {
        account_create_error: false,
        account_create_pending: true,
        account_create_resolved: false,
      });
    case PROCESSING_ACCOUNT_CREATE_CANCEL:
      return Object.assign({}, state, {
        account_create_error: false,
        account_create_pending: false,
        account_create_resolved: false,
      });
    case PROCESSING_ACCOUNT_CREATE_COMPLETE:
      return Object.assign({}, state, {
        account_create_error: false,
        account_create_pending: false,
        account_create_resolved: true,
      });
    case PROCESSING_ACCOUNT_CREATE_FAILED:
      return Object.assign({}, state, {
        account_create_error: action.payload.message,
        account_create_pending: false,
        account_create_resolved: false,
      });
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
    case ACCOUNT_CUSTOM_JSON_STARTED:
      return Object.assign({}, state, {
        account_custom_json_error: false,
        account_custom_json_resolved: false,
        account_custom_json_pending: true
      });
    case ACCOUNT_CUSTOM_JSON_FAILED:
      return Object.assign({}, state, {
        account_custom_json_error: setError(action.payload),
        account_custom_json_resolved: false,
        account_custom_json_pending: false
      });
    case ACCOUNT_CUSTOM_JSON_RESOLVED:
      return Object.assign({}, state, {
        account_custom_json_error: false,
        account_custom_json_resolved: true,
        account_custom_json_pending: false
      });
    case ACCOUNT_CUSTOM_JSON_COMPLETED:
      return Object.assign({}, state, {
        account_custom_json_error: false,
        account_custom_json_resolved: false,
        account_custom_json_pending: false
      });
    case ACCOUNT_CUSTOM_OPS_STARTED:
      return Object.assign({}, state, {
        account_custom_ops_error: false,
        account_custom_ops_resolved: false,
        account_custom_ops_pending: true
      });
    case ACCOUNT_CUSTOM_OPS_FAILED:
      return Object.assign({}, state, {
        account_custom_ops_error: setError(action.payload),
        account_custom_ops_resolved: false,
        account_custom_ops_pending: false
      });
    case ACCOUNT_CUSTOM_OPS_RESOLVED:
      return Object.assign({}, state, {
        account_custom_ops_error: false,
        account_custom_ops_resolved: true,
        account_custom_ops_pending: false
      });
    case ACCOUNT_CUSTOM_OPS_COMPLETED:
      return Object.assign({}, state, {
        account_custom_ops_error: false,
        account_custom_ops_resolved: false,
        account_custom_ops_pending: false
      });
    case ACCOUNT_TRANSFER_COMPLETED:
      return Object.assign({}, state, {
        account_transfer_error: false,
        account_transfer_resolved: false,
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
    case ACCOUNT_VOTE_WITNESS_STARTED:
      return Object.assign({}, state, {
        account_vote_witness_resolved: false,
        account_vote_witness_error: false,
        account_vote_witness_pending: true,
      });
    case ACCOUNT_VOTE_WITNESS_FAILED:
      return Object.assign({}, state, {
        account_vote_witness_resolved: false,
        account_vote_witness_error: setError(action.payload),
        account_vote_witness_pending: false,
      });
    case ACCOUNT_VOTE_WITNESS_RESOLVED:
      return Object.assign({}, state, {
        account_vote_witness_resolved: true,
        account_vote_witness_error: false,
        account_vote_witness_pending: false,
      });
    case ACCOUNT_VOTE_WITNESS_COMPLETED:
      return Object.assign({}, state, {
        account_vote_witness_resolved: false,
        account_vote_witness_error: false,
        account_vote_witness_pending: false,
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
  try {
    const stack = response.payload.error.data.stack[0];
    const values = Object.keys(stack.data);
    let message = stack.format;
    if (values.length) {
      values.map((key) => {
        const value = stack.data[key];
        message = message.split('${' + key + '}').join(value);
      });
    }
    return message;
  } catch (e) {
    console.log(e);
    console.log(response);
    return 'Unknown Error, check View -> Devtools for more information.';
  }
}
