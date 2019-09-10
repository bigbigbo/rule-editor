import React from 'react';
import { Button } from 'antd';

import ValueSelect from '../ValueSelect'
import ConditionView from '../ConditionView';
import ActionView from '../ActionView'
import RulePropsView from '../PropsView/RulePropsView';

import styles from './styles/DecisionSetEditor.module.scss';

import useConnect from '../../store/useConnect';
import useConfig from '../../store/useConfig'

import { LOOP_RULE } from '../../constants/ruleType'
import { INPUT, VARIABLE, CONSTANT, FUNC } from '../../constants/valueType'

const TRUE_ACTIONS = 'trueActions'
const FALSE_ACTIONS = 'falseActions'



const DecisionSetEditor = () => {
  const { constants, variables, funcs } = useConfig();
  const { decisionSet, dispatch } = useConnect(state => ({ decisionSet: state.decisionSet }));

  const { attrs = {}, loopTarget = {}, conditionRules = [], startActions = [], endActions = [] } = decisionSet;
  const isLoopRule = attrs.ruleType === LOOP_RULE

  const options = [
    {
      label: '输入值',
      value: INPUT
    },
    {
      label: '选择变量',
      value: VARIABLE,
      children: variables
    },
    {
      label: '选择常量',
      value: CONSTANT,
      children: constants
    },
    {
      label: '选择函数',
      value: FUNC,
      children: funcs
    }
  ]

  const handleLoopTargetChange = ({ parentId, valueId, type, value }) => {
    dispatch({
      type: 'decisionSet/setLoopTarget',
      payload: {
        id: parentId,
        valueId,
        value,
        valueType: type,
      }
    })
  }

  const handleAddUnitRule = () => {
    dispatch({
      type: 'decisionSet/addUnitRule'
    })
  }


  return (
    <div>
      <div className={styles.toolbar}>
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
                {isLoopRule && <React.Fragment>
                  <div className={styles['sub-title']} style={{ borderColor: 'green' }} >循环对象</div>
                  <ValueSelect dispatch={dispatch} rawdata={loopTarget} options={options} constants={constants} onChange={handleLoopTargetChange} />
                </React.Fragment>}

                {isLoopRule && <React.Fragment>
                  <div className={styles['sub-title']} style={{ marginTop: 20, borderColor: 'green' }} >开始前动作</div>
                  <ActionView
                    ruleId={'startActions'}
                    dispatch={dispatch}
                    position={'startActions'}
                    actions={startActions}
                    constants={constants}
                    variables={variables}
                    funcs={funcs} />
                </React.Fragment>}

                {
                  conditionRules.map(rule => {
                    const { id, rootCondition = {}, trueActions = [], falseActions = [] } = rule;

                    const loopStyle = {
                      padding: 8,
                      margin: 8,
                      borderRadious: 4,
                      border: '1px dashed #c9c9c9',
                    }
                    return <React.Fragment key={id}>


                      <div style={isLoopRule ? loopStyle : {}}>
                        <div className={styles['sub-title']}>如果</div>
                        <ConditionView
                          ruleId={id}
                          rootCondition={rootCondition}
                          dispatch={dispatch}
                          constants={constants}
                          variables={variables}
                          funcs={funcs}
                        />

                        <div className={styles['sub-title']} style={{ marginTop: 20 }}>那么</div>
                        <ActionView
                          ruleId={id}
                          dispatch={dispatch}
                          position={TRUE_ACTIONS}
                          actions={trueActions}
                          constants={constants}
                          variables={variables}
                          funcs={funcs} />

                        <div className={styles['sub-title']} style={{ marginTop: 20 }}>否则</div>
                        <ActionView
                          ruleId={id}
                          dispatch={dispatch}
                          position={FALSE_ACTIONS}
                          actions={falseActions}
                          constants={constants}
                          variables={variables}
                          funcs={funcs} />
                      </div>
                    </React.Fragment>
                  })
                }

                {isLoopRule && <Button type="primary" style={{ marginLeft: 8 }} onClick={handleAddUnitRule}>添加条件判断单元</Button>}

                {isLoopRule && <React.Fragment>
                  <div className={styles['sub-title']} style={{ marginTop: 20, borderColor: 'green' }} >结束后动作</div>
                  <ActionView
                    ruleId={'endActions'}
                    dispatch={dispatch}
                    position={'endActions'}
                    actions={endActions}
                    constants={constants}
                    variables={variables}
                    funcs={funcs} />
                </React.Fragment>}

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
