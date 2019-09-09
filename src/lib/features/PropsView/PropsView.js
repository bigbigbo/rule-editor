import React from "react";

import RulePropsView from "./RulePropsView";

import styles from './styles/index.module.scss'


const PropsView = props => {
  const { form } = props;

  return (
    <div className={styles.container}>
      <RulePropsView form={form}></RulePropsView>
    </div>
  );
};

export default PropsView;
