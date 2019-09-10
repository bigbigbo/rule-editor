import React from 'react';
import { Button } from 'antd';

import ConditionView from '../ConditionView';
import ActionView from '../ActionView'
import RulePropsView from '../PropsView/RulePropsView';

import styles from './styles/DecisionSetEditor.module.scss';

import useConnect from '../../store/useConnect';
import useConfig from '../../store/useConfig'

const TRUE_ACTIONS = 'trueActions'
const FALSE_ACTIONS = 'falseActions'

const DecisionSetEditor = () => {
  const { constants, variables, funcs } = useConfig();
  const { decisionSet, dispatch } = useConnect(state => ({ decisionSet: state.decisionSet }));

  const { attrs, rootCondition, trueActions = [], falseActions = [] } = decisionSet;

  return (
    <div>
      <div className={styles.toolbar}>
        {/* <Button type="primary" ghost icon="plus">
          新建规则
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" ghost icon="plus-circle">
          新建循环规则
        </Button> */}
        <div style={{ float: 'right' }}>
          <Button type="primary">保存</Button>
        </div>
      </div>
      <div className={styles.layout}>
        <div className={styles.content}>
          <div className={styles.rule__wrapper}>
            <div className={styles.rule__container}>
              <h2 className={styles.title}>{attrs.name}</h2>
              <div className={styles.rule}>
                <div className={styles['sub-title']}>如果</div>

                <ConditionView
                  rootCondition={rootCondition}
                  dispatch={dispatch}
                  constants={constants}
                  variables={variables}
                  funcs={funcs}
                />

                <div className={styles['sub-title']} style={{ marginTop: 20 }}>那么</div>
                <ActionView
                  dispatch={dispatch}
                  position={TRUE_ACTIONS}
                  actions={trueActions}
                  constants={constants}
                  variables={variables}
                  funcs={funcs}></ActionView>

                <div className={styles['sub-title']} style={{ marginTop: 20 }}>否则</div>
                <ActionView
                  dispatch={dispatch}
                  position={FALSE_ACTIONS}
                  actions={falseActions}
                  constants={constants}
                  variables={variables}
                  funcs={funcs}></ActionView>

              </div>
            </div>
          </div>
        </div>
        <div className={styles.sider}>
          <RulePropsView attrs={attrs} dispatch={dispatch}></RulePropsView>
        </div>
      </div>
    </div>
  );
};

export default DecisionSetEditor;
