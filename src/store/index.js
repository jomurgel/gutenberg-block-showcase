/**
 * WordPress dependencies.
 */
import { createReduxStore } from '@wordpress/data';

/**
 * Redux elements.
 */
import * as actions from './actions';

/**
 * Default state.
 */
const DEFAULT_STATE = {
  postLocks: [],
  postRevisions: [],
};

/**
 * Create GBS-specific global store.
 *
 * Example: https://github.com/WordPress/gutenberg/blob/wp/6.0/packages/edit-site/src/store/index.js.
 */
export const store = createReduxStore('gbs/store', {
  /**
   * Redux reducer.
   *
   * @param {Object} state  Default state object.
   * @param {Object} action Action object.
   */
  reducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
      case 'SET_LOCK':
        return {
          ...state,
          postLocks: [
            ...new Set([...state.postLocks, action.lockId]),
          ],
        };
      case 'REMOVE_LOCK':
        return {
          ...state,
          postLocks:
            [
              ...state.postLocks.filter(
                (lock) => lock !== action.lockId
              ),
            ] || [],
        };
      case 'SET_SETTINGS':
        return {
          ...state,
          settings: action.settings,
        };
      case 'SET_REVISIONS':
        return {
          ...state,
          postRevisions: action.postRevisions,
        };
      // skip default
    }

    return state;
  },
  actions,
  selectors: {
    isPostLocked(state) {
      return state?.postLocks?.length;
    },
    getPostLocks(state) {
      return state?.postLocks;
    },
    getPostRevisions(state) {
      return state?.postRevisions;
    },
  },
});
