// @flow
import {
  KEY_REMOVE_CANCEL,
  KEY_REMOVE_CONFIRM,
  KEY_REMOVE_CONFIRMED,
  KEY_USE,
  KEY_USE_DECRYPT_PROMPT,
  KEY_USE_DECRYPT_PROMPT_CLOSE,
  KEY_ADD_CANCEL,
  KEY_ADD_CONFIRM,
  KEY_ADD_CONFIRMED,
  KEY_ADD_FAILED_ACCOUNT_404,
  KEY_ADD_FAILED_WIF_INCORRECT,
  KEY_ADD_FAILED_WIF_INVALID,
  KEY_ADD_PROMPT
} from '../actions/keys';

const defaultState = {
  names: [],
  permissions: {}
};

type actionType = {
  type: string,
  payload: any
};

export default function keys(state: any = defaultState, action: actionType) {
  // console.log('>>> reducers/account', state, action);
  switch (action.type) {
    case KEY_ADD_PROMPT: {
      return Object.assign({}, state, {
        addPrompt: true
      });
    }
    case KEY_ADD_CANCEL: {
      return Object.assign({}, state, {
        addPrompt: false,
        confirm: false
      });
    }
    case KEY_ADD_CONFIRM: {
      return Object.assign({}, state, {
        addPrompt: true,
        confirm: action.payload
      });
    }
    case KEY_ADD_CONFIRMED: {
      const newPermissions = {
        ...state.permissions,
        ...action.payload
      };
      return Object.assign({}, state, {
        addPrompt: false,
        confirm: false,
        isUser: true,
        names: [...Object.keys(newPermissions)].sort(),
        permissions: newPermissions
      });
    }
    case KEY_ADD_FAILED_ACCOUNT_404:
      return Object.assign({}, state, {
        lastError: 'Account not found!'
      });
    case KEY_ADD_FAILED_WIF_INVALID:
      return Object.assign({}, state, {
        lastError: 'Invalid WIF Key!'
      });
    case KEY_ADD_FAILED_WIF_INCORRECT:
      return Object.assign({}, state, {
        lastError: 'Invalid WIF Key for Account!'
      });
    case KEY_USE: {
      const { account } = action.payload;
      const { encrypted, key } = state.permissions[account];
      // console.log(state);
      return state;
      // return Object.assign({}, state, {
      //   requested:
      // });
    }
    case KEY_USE_DECRYPT_PROMPT: {
      const { operation, params, auth } = action.payload;
      return Object.assign({}, state, {
        decrypt: { operation, params, auth }
      })
      return state;
    }
    case KEY_USE_DECRYPT_PROMPT_CLOSE: {
      return Object.assign({}, state, {
        decrypt: false
      })
      return state;
    }
    case KEY_REMOVE_CANCEL: {
      return Object.assign({}, state, {
        remove: false
      });
    }
    case KEY_REMOVE_CONFIRM: {
      return Object.assign({}, state, {
        remove: action.payload
      });
    }
    case KEY_REMOVE_CONFIRMED: {
      const newPermissions = Object.assign({}, state.permissions);
      delete newPermissions[action.payload];
      const newNames = [...Object.keys(newPermissions)].sort();
      return Object.assign({}, state, {
        isUser: !!newNames.length,
        names: newNames,
        permissions: newPermissions,
        remove: false
      });
    }
    default: {
      return state;
    }
  }
}
