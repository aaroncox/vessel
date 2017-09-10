// @flow
import type { processingStateType } from '../reducers/processing';

export const PROCESSING_ACCOUNT_LOADING = 'PROCESSING_ACCOUNT_LOADING';
export const PROCESSING_ACCOUNT_LOADING_FAILED = 'PROCESSING_ACCOUNT_LOADING_FAILED';
export const PROCESSING_ACCOUNT_LOADING_COMPLETE = 'PROCESSING_ACCOUNT_LOADING_COMPLETE';
export const PROCESSING_REWARD_CLAIM = 'PROCESSING_REWARD_CLAIM';
export const PROCESSING_REWARD_CLAIM_COMPLETE = 'PROCESSING_REWARD_CLAIM_COMPLETE';
export const PROCESSING_ACCOUNT_CREATE = 'PROCESSING_ACCOUNT_CREATE';
export const PROCESSING_ACCOUNT_CREATE_CANCEL = 'PROCESSING_ACCOUNT_CREATE_CANCEL';
export const PROCESSING_ACCOUNT_CREATE_COMPLETE = 'PROCESSING_ACCOUNT_CREATE_COMPLETE';
export const PROCESSING_ACCOUNT_CREATE_FAILED = 'PROCESSING_ACCOUNT_CREATE_FAILED';

export function processingRewardClaim() {
  return {
    type: PROCESSING_REWARD_CLAIM
  };
}

export function processingRewardClaimComplete() {
  return {
    type: PROCESSING_REWARD_CLAIM_COMPLETE
  };
}

export function processingAccountCreate() {
  return {
    type: PROCESSING_ACCOUNT_CREATE
  };
}

export function processingAccountCreateCancel() {
  return {
    type: PROCESSING_ACCOUNT_CREATE_CANCEL
  };
}

export function processingAccountCreateComplete() {
  return {
    type: PROCESSING_ACCOUNT_CREATE_COMPLETE
  };
}

export function processingAccountCreateFailed(payload) {
  return {
    type: PROCESSING_ACCOUNT_CREATE_FAILED,
    payload
  };
}
