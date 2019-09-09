import { useContext } from 'react';
import { context } from './index';

export default (selectState = () => {}) => {
  const { state: storeState, dispatch } = useContext(context);

  const state = selectState(storeState);

  return { ...state, dispatch };
};
