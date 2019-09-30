/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import cx from 'classnames';
import { Dropdown, Menu } from 'antd';

import styles from './styles/index.module.scss';

import { AND, OR, NORMAL } from '../../constants/conditionType';

const Unite = props => {
  const { disabled = false, isRoot = false, isLast, id, parentId, isAndType, onChanageConditionType, onAddCondition, onDelete } = props;

  const hasChildren = props.children.length > 0;

  const wrapperCx = cx(styles['unite-condition__wrapper'], {
    [styles['unite-condition__wrapper--last']]: isLast
  });
  const toolCx = cx(styles.toolbar, styles.display, {
    [styles['display--no-border']]: isRoot
  });
  const toolContainerCx = cx(styles.toolbar__container, {
    [styles['toolbar__container--hasChildren']]: hasChildren
  });

  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => onChanageConditionType(id, AND)}>并且</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => onChanageConditionType(id, OR)}>或者</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a onClick={() => onAddCondition(id, NORMAL)}>添加条件</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => onAddCondition(id, AND)}>添加联合条件</a>
      </Menu.Item>
      {!isRoot && <Menu.Divider />}
      {!isRoot && (
        <Menu.Item disabled={disabled}>
          <a style={{ color: 'red' }} onClick={() => onDelete(id, parentId)}>
            删除
          </a>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className={wrapperCx}>
      <div className={styles['toolbar__wrapper']}>
        <div className={toolContainerCx}>
          <div className={toolCx}>
            <Dropdown.Button size="small" overlay={menu} disabled={disabled}>
              {isAndType ? '并且' : '或者'}
            </Dropdown.Button>
          </div>
        </div>
      </div>

      {hasChildren > 0 && (
        <div className={styles.condition__container}>
          {React.Children.map(props.children, (child, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === props.children.length - 1;

            return (
              <div className={styles.condition}>
                {React.cloneElement(child, { isLast })}
                {isFirst && <div className={`${styles['cover-line']} ${styles['cover-line--top']}`}></div>}
                {isLast && <div className={`${styles['cover-line']} ${styles['cover-line--bottom']}`}></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Unite;
