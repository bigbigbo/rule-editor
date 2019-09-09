import { useReducer } from 'react';
import models from './models';

function createReducers(reducers) {
  return (state, action) => {
    if (reducers[action.type] && typeof reducers[action.type] === 'function') {
      const { namespace } = reducers[action.type];
      const storeState = {
        ...state,
        [namespace]: reducers[action.type](state[namespace], action, state)
      };
      return storeState;
    } else {
      throw new Error('unregister action type:' + action.type);
    }
  };
}

const reducer = createReducers(models.reducers);

export default function useCreateStore() {
  const [state, dispatch] = useReducer(reducer, models.state);

  function enhanceDispatch(action) {
    return new Promise(resolve => {
      const { type } = action;

      if (models.reducers[type]) {
        const result = dispatch(action);
        resolve(result);
      }

      if (models.effects[type]) {
        const result = models.effects[type](action, {
          state,
          dispatch
        });
        result.then(resolve);
      }
    });
  }

  return {
    state,
    dispatch: enhanceDispatch
  };
}
