// @flow
import steem from 'steem';
import * as ProcessingActions from './processing';

export const STEEM_GLOBALPROPS_UPDATE = 'STEEM_GLOBALPROPS_UPDATE';
export const STEEM_GLOBALPROPS_UPDATE_RESOLVED = 'STEEM_GLOBALPROPS_UPDATE_RESOLVED';

export function refreshGlobalProps() {
  return (dispatch: () => void) => {
    steem.api.getDynamicGlobalProperties((err, results) => {
      if (err) {
        // dispatch({
        //   type: ACCOUNT_DATA_UPDATE_FAILED,
        //   payload: err
        // });
      } else {
        dispatch({
          type: STEEM_GLOBALPROPS_UPDATE_RESOLVED,
          payload: results
        });
      }
    });
  };
}
