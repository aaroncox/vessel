// @flow
import steem from 'steem';
import type { keysStateType } from '../reducers/keys';
import * as AccountActions from './account';
import {
  PROCESSING_ACCOUNT_LOADING,
  PROCESSING_ACCOUNT_LOADING_COMPLETE,
  PROCESSING_ACCOUNT_LOADING_FAILED
} from './processing';

var CryptoJS = require("crypto-js");

export const KEY_REMOVE_CANCEL = 'KEY_REMOVE_CANCEL';
export const KEY_REMOVE_CONFIRM = 'KEY_REMOVE_CONFIRM';
export const KEY_REMOVE_CONFIRMED = 'KEY_REMOVE_CONFIRMED';
export const KEY_USE = 'KEY_USE';
export const KEY_USE_DECRYPT_PROMPT = 'KEY_USE_DECRYPT_PROMPT';
export const KEY_USE_DECRYPT_PROMPT_CLOSE = 'KEY_USE_DECRYPT_PROMPT_CLOSE';
export const KEY_ADD_CANCEL = 'KEY_ADD_CANCEL';
export const KEY_ADD_CONFIRM = 'KEY_ADD_CONFIRM';
export const KEY_ADD_CONFIRMED = 'KEY_ADD_CONFIRMED';
export const KEY_ADD_FAILED = 'KEY_ADD_FAILED';
export const KEY_ADD_FAILED_ACCOUNT_404 = 'KEY_ADD_FAILED_ACCOUNT_404';
export const KEY_ADD_FAILED_WIF_INCORRECT = 'KEY_ADD_FAILED_WIF_INCORRECT';
export const KEY_ADD_FAILED_WIF_INVALID = 'KEY_ADD_FAILED_WIF_INVALID';
export const KEY_ADD_MEMO_CANCEL = 'KEY_ADD_MEMO_CANCEL';
export const KEY_ADD_MEMO_CONFIRM = 'KEY_ADD_MEMO_CONFIRM';
export const KEY_ADD_MEMO_CONFIRMED = 'KEY_ADD_MEMO_CONFIRMED';
export const KEY_ADD_MEMO_PROMPT = 'KEY_ADD_MEMO_PROMPT';
export const KEY_ADD_PROMPT = 'KEY_ADD_PROMPT';
export const KEY_CREATE_CANCEL = 'KEY_CREATE_CANCEL';
export const KEY_CREATE_PROMPT = 'KEY_CREATE_PROMPT';


export function addKey(account: string, wif: string) {
  const isValidKey = steem.auth.isWif(wif);
  if (isValidKey) {
    return (dispatch: () => void) => {
      dispatch({
        type: PROCESSING_ACCOUNT_LOADING
      });
      steem.api.getAccounts([account], (err, result) => {
        // Account not found
        if (err || !result.length) {
          dispatch({
            type: KEY_ADD_FAILED_ACCOUNT_404
          });
          dispatch({
            type: PROCESSING_ACCOUNT_LOADING_COMPLETE
          });
        }
        if (result && result.length) {
          const derivedKey = steem.auth.wifToPublic(wif);
          const keyTypes = getKeyType(derivedKey, result[0]);
          if (keyTypes.length > 0) {
            // Correct key + weight, save keyAuths
            const payload = {
              account,
              wif,
              active: (keyTypes.indexOf('active') !== -1),
              posting: (keyTypes.indexOf('posting') !== -1),
              owner: (keyTypes.indexOf('owner') !== -1)
            };
            dispatch({
              type: PROCESSING_ACCOUNT_LOADING_COMPLETE
            });
            dispatch({
              type: KEY_ADD_CONFIRM,
              payload
            });
          } else {
            // Incorrect key for account
            dispatch({
              type: PROCESSING_ACCOUNT_LOADING_COMPLETE
            });
            dispatch({
              type: KEY_ADD_FAILED_WIF_INCORRECT
            });
          }
        }
      });
    };
  }
  return {
    type: KEY_ADD_FAILED_WIF_INVALID
  };
}

export function addKeyConfirmed(
  account: string,
  wif: string,
  type: string,
  encrypted: boolean,
  password: string
  ) {
  return (dispatch: () => void) => {
    let key = wif;
    const payload = {};
    if (encrypted) {
      key = CryptoJS.AES.encrypt(wif, password).toString();
    }
    payload[account] = {
      account,
      key,
      encrypted,
      type
    };
    dispatch({
      type: KEY_ADD_CONFIRMED,
      payload
    });
  };
}

export function addKeyCancel() {
  return {
    type: KEY_ADD_CANCEL
  };
}

export function addKeyPrompt() {
  return {
    type: KEY_ADD_PROMPT
  };
}

export function createKeyPrompt() {
  return {
    type: KEY_CREATE_PROMPT
  }
}

export function createKeyCancel() {
  return {
    type: KEY_CREATE_CANCEL
  }
}

// Given an account and a keys
// Check if key is encrypted

export function useKeyRequestDecrypt(operation, params, auth) {
  return {
    type: KEY_USE_DECRYPT_PROMPT,
    payload: { operation, params, auth }
  };
}

export function useKeyRequestDecryptClose() {
  return {
    type: KEY_USE_DECRYPT_PROMPT_CLOSE
  };
}

export function useKey(operation, params, auth) {
  return (dispatch: () => void) => {
    if (auth.encrypted) {
      const authEncrypted = Object.assign({}, auth);
      dispatch(useKeyRequestDecrypt(operation, params, authEncrypted));
    } else {
      const callback = AccountActions[operation];
      dispatch(callback(auth.key, params));
      dispatch(useKeyRequestDecryptClose());
    }
  };
}

export function getKeyType(wif: string, account: object) {
  const validFor = [];
  ['owner', 'active', 'posting'].forEach((keyType) => {
    const keyAuths = account[keyType].key_auths;
    const weightThreshold = account[keyType].weight_threshold;
    const matchingWeight = keyAuths
      .filter((set) => set[0] === wif)
      .map((set) => set[1])
      .reduce((a, b) => a + b, 0);
    if (matchingWeight >= weightThreshold) {
      validFor.push(keyType);
    }
  });
  return validFor;
}

export function removeKey(account: string) {
  return {
    type: KEY_REMOVE_CONFIRM,
    payload: account
  };
}

export function removeKeyConfirmed(account: string) {
  return {
    type: KEY_REMOVE_CONFIRMED,
    payload: account
  };
}

export function removeKeyCancel() {
  return {
    type: KEY_REMOVE_CANCEL
  };
}

export function addMemoKey(account: string, wif: string) {
  const isValidKey = steem.auth.isWif(wif);
  if (isValidKey) {
    return (dispatch: () => void) => {
      steem.api.getAccounts([account], (err, result) => {
        if (result && result.length) {
          const derivedKey = steem.auth.wifToPublic(wif);
          if (derivedKey === result[0].memo_key) {
            const payload = {
              account,
              wif
            };
            dispatch({
              type: KEY_ADD_MEMO_CONFIRMED,
              payload
            });
          } else {
            // Incorrect key for account
          }
        }
      });
    };
  }
  return {
    type: KEY_ADD_FAILED_WIF_INVALID
  };
}

export function addMemoKeyPrompt(account: string) {
  return (dispatch: () => void) => {
    steem.api.getAccounts([account], (err, result) => {
      dispatch({
        type: KEY_ADD_MEMO_PROMPT,
        payload: {
          account,
          public: result[0].memo_key
        }
      });
    })
  }
}

export function addMemoKeyConfirmed(payload) {
  return {
    type: KEY_ADD_MEMO_CONFIRMED,
    payload
  };
}

export function addMemoKeyCancel() {
  return {
    type: KEY_ADD_MEMO_CANCEL
  };
}
