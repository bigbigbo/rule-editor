import React from 'react';

import styles from './styles/index.module.scss'

const Sider = (props) => {
  return (
    <div className={styles.sider}>
      {props.children}
    </div>
  );
};

export default Sider;