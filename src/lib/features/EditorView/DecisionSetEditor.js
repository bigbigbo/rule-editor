import React, { useEffect } from 'react';
import { Input, Button, Modal } from 'antd';

import ValueSelect from '../ValueSelect';
import ConditionView from '../ConditionView';
import ActionView from '../ActionView';
import RulePropsView from '../PropsView/RulePropsView';

import styles from './styles/DecisionSetEditor.module.scss';

import useConnect from '../../store/useConnect';
import useConfig from '../../store/useConfig';

import { LOOP_RULE } from '../../constants/ruleType';
import { INPUT, VARIABLE, CONSTANT, FUNC } from '../../constants/valueType';

const TRUE_ACTIONS = 'trueActions';
const FALSE_ACTIONS = 'falseActions';
const START_ACTIONS = 'startActions';
const END_ACTIONS = 'endActions';

const DecisionSetEditor = props => {
  const { disabled = false, saveLoading = false, onChange, onSubmit, onCancel } = props;
  const { constants, variables, funcs } = useConfig();
  const { decisionSet, dispatch } = useConnect(state => ({ decisionSet: state.decisionSet }));

  const { attrs = {}, loopTarget = {}, conditionRules = [], startActions = [], endActions = [] } = decisionSet;

  // 是否是循环规则
  const isLoopRule = attrs.ruleType === LOOP_RULE;

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
  ];

  // 设置循环对象
  const handleChangeLoopTarget = ({ parentId, valueId, type, value }) => {
    dispatch({
      type: 'decisionSet/setLoopTarget',
      payload: {
        id: parentId,
        valueId,
        value,
        valueType: type
      }
    });
  };

  // 循环规则：添加单元判断条件
  const handleAddUnitRule = () => {
    dispatch({
      type: 'decisionSet/addUnitRule'
    });
  };

  // 循环规则：删除单元判断条件
  const handleDeleteUnitRule = id => {
    dispatch({
      type: 'decisionSet/deleteUnitRule',
      payload: {
        id
      }
    });
  };

  // 循环规则：改变单元名称
  const handleChangeUnitRuleName = (id, { target: { value } }) => {
    dispatch({
      type: 'decisionSet/setUnitRuleName',
      payload: {
        id,
        name: value
      }
    });
  };

  // 保存
  const handleSubmit = () => {
    console.log('decisionSet', decisionSet);
    const { attrs, loopTarget, conditionRules } = decisionSet;

    if (!attrs.name) {
      Modal.warning({
        title: '请输入规则名称',
        content: '规则名称不能为空',
        okText: '确定'
      });
      return;
    }

    if (attrs.ruleType === LOOP_RULE) {
      if (!loopTarget.type) {
        Modal.warning({
          title: '请设置循环对象',
          content: '循环对象不能为空',
          okText: '确定'
        });
        return;
      }

      if (!loopTarget.value || Object.keys(loopTarget.value).length === 0) {
        Modal.warning({
          title: '请设置循环对象的值类型',
          content: '循环对象的值类型不能为空',
          okText: '确定'
        });
        return;
      }
    }

    for (let i = 0; i < conditionRules.length; i++) {
      const condition = conditionRules[i];
      const { trueActions, falseActions, rootCondition } = condition;

      if (rootCondition.subConditions.length === 0) {
        Modal.warning({
          title: '请添加至少一个条件',
          content: '【如果】条件不能为空',
          okText: '确定'
        });
        return;
      }

      // 如果所有条件都只是建立了但没有设置任何值类型
      const isInvalidCondition = rootCondition.subConditions.every(item => !item.expression.left.type);
      if (isInvalidCondition) {
        Modal.warning({
          title: '请为条件添加值类型',
          content: '条件的值类型不能全为空',
          okText: '确定'
        });
        return;
      }

      if (trueActions.length === 0 && falseActions.length === 0) {
        Modal.warning({
          title: '请为【那么】【否则】添加至少一个动作',
          content: '【那么】【否则】不能全为空',
          okText: '确定'
        });
        return;
      }

      const isInvalidTrueActions = trueActions.every(item => !item.type);
      if (trueActions.length > 0 && isInvalidTrueActions) {
        Modal.warning({
          title: '请为【那么】添加有效的动作类型',
          content: '动作类型不能全为空',
          okText: '确定'
        });
        return;
      }

      const isInvalidFalseActions = falseActions.every(item => !item.type);
      if (falseActions.length > 0 && isInvalidFalseActions) {
        Modal.warning({
          title: '请为【否则】添加有效的动作类型',
          content: '动作类型不能全为空',
          okText: '确定'
        });
        return;
      }
    }

    onSubmit && onSubmit(decisionSet);
  };

  useEffect(() => {
    onChange && onChange(decisionSet);
  }, [decisionSet]);

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.rule__wrapper}>
          <div className={styles.rule__container}>
            <h2 className={styles.title} style={{ color: attrs.name ? 'rgba(0, 0, 0, 0.85)' : '#c9c9c9' }}>
              {attrs.name || '请输入规则名称'}
            </h2>
            <div className={styles.rule}>
              {isLoopRule && (
                <React.Fragment>
                  <div className={styles['sub-title']} style={{ borderColor: 'green' }}>
                    循环对象
                  </div>
                  <ValueSelect
                    disabled={disabled}
                    dispatch={dispatch}
                    rawdata={loopTarget}
                    options={options}
                    constants={constants}
                    onChange={handleChangeLoopTarget}
                  />
                </React.Fragment>
              )}

              {isLoopRule && (
                <React.Fragment>
                  <div className={styles['sub-title']} style={{ marginTop: 20, borderColor: 'green' }}>
                    开始前动作
                  </div>
                  <ActionView
                    disabled={disabled}
                    ruleId={START_ACTIONS}
                    position={START_ACTIONS}
                    dispatch={dispatch}
                    actions={startActions}
                    constants={constants}
                    variables={variables}
                    funcs={funcs}
                  />
                </React.Fragment>
              )}

              {conditionRules.map(rule => {
                const { id, name, rootCondition = {}, trueActions = [], falseActions = [] } = rule;

                const loopStyle = {
                  padding: 8,
                  margin: 8,
                  borderRadius: 4,
                  border: '1px dashed #c9c9c9'
                };

                return (
                  <React.Fragment key={id}>
                    <div style={isLoopRule ? loopStyle : {}}>
                      {isLoopRule && (
                        <div style={{ marginBottom: 16 }}>
                          名称：
                          <Input
                            disabled={disabled}
                            value={name}
                            style={{ width: '50%' }}
                            onChange={e => handleChangeUnitRuleName(id, e)}
                          ></Input>
                          &nbsp;&nbsp;
                          <Button
                            type="danger"
                            onClick={() => handleDeleteUnitRule(id)}
                            disabled={disabled || conditionRules.length === 1}
                            title={conditionRules.length === 1 ? '至少一个条件判断单元' : ''}
                          >
                            删除
                          </Button>
                        </div>
                      )}

                      <div className={styles['sub-title']}>如果</div>
                      <ConditionView
                        disabled={disabled}
                        ruleId={id}
                        rootCondition={rootCondition}
                        dispatch={dispatch}
                        constants={constants}
                        variables={variables}
                        funcs={funcs}
                      />

                      <div className={styles['sub-title']} style={{ marginTop: 20 }}>
                        那么
                      </div>
                      <ActionView
                        ruleId={id}
                        dispatch={dispatch}
                        disabled={disabled}
                        position={TRUE_ACTIONS}
                        actions={trueActions}
                        constants={constants}
                        variables={variables}
                        funcs={funcs}
                      />

                      <div className={styles['sub-title']} style={{ marginTop: 20 }}>
                        否则
                      </div>
                      <ActionView
                        ruleId={id}
                        dispatch={dispatch}
                        disabled={disabled}
                        position={FALSE_ACTIONS}
                        actions={falseActions}
                        constants={constants}
                        variables={variables}
                        funcs={funcs}
                      />
                    </div>
                  </React.Fragment>
                );
              })}

              {!disabled && isLoopRule && (
                <Button type="primary" style={{ marginLeft: 8 }} onClick={handleAddUnitRule}>
                  添加条件判断单元
                </Button>
              )}

              {isLoopRule && (
                <React.Fragment>
                  <div className={styles['sub-title']} style={{ marginTop: 20, borderColor: 'green' }}>
                    结束后动作
                  </div>
                  <ActionView
                    ruleId={END_ACTIONS}
                    position={END_ACTIONS}
                    disabled={disabled}
                    dispatch={dispatch}
                    actions={endActions}
                    constants={constants}
                    variables={variables}
                    funcs={funcs}
                  />
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sider}>
        <RulePropsView
          disabled={disabled}
          saveLoading={saveLoading}
          attrs={attrs}
          dispatch={dispatch}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        ></RulePropsView>
      </div>
    </div>
  );
};

export default DecisionSetEditor;
