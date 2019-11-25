import { useContext } from 'react';
import { context } from './index';

export default (selectState = () => {}) => {
  const { constants, variables, funcs } = useContext(context);

  return { constants, variables, funcs };
};
