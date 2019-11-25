import React from 'react';

import styles from './styles/index.module.scss';

const Layout = props => {
  return <div className={styles.layout}>{props.children}</div>;
};

export default Layout;
