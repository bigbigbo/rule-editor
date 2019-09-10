import React, { createContext } from 'react';
import useCreateSotre from './createSotre';

export const context = createContext(null);

const Provider = props => {
  const { initialValue, constants, variables, funcs } = props;
  const { state, dispatch } = useCreateSotre({ decisionSet: initialValue });

  console.groupCollapsed('storeState');
  console.log(state);
  console.log(JSON.stringify(state));
  console.groupEnd();

  return <context.Provider value={{ state, dispatch, constants, variables, funcs }}>{props.children}</context.Provider>;
};

export default Provider;
