import React from 'react';

import styles from './styles/index.module.scss';

const Content = props => {
  return <div className={styles.content}>{props.children}</div>;
};

export default Content;
