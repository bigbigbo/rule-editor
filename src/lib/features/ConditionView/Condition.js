/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { useMemo } from 'react';

import { Popconfirm, Dropdown, Menu } from 'antd';
import ValueSelect from '../ValueSelect'

import styles from './styles/index.module.scss';

import { getNode } from '../../utils/decisionSet'
import { INPUT, VARIABLE, CONSTANT, FUNC, OPERATE, OPERATE_CHATORATOR } from '../../constants/valueType'

const LEFT = 'left'
const RIGHT = 'right'

const Condition = props => {
  const { id, parentId, onDelete, dispatch, constants, variables, funcs, rootCondition } = props;

  const currValue = useMemo(() => {
    return getNode([rootCondition], id)
  }, [id, rootCondition])

  const { expression = {} } = currValue || {}
  const { left = {}, operator, right = {} } = expression;

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

  const rightOptions = (left.type === VARIABLE && left.value && left.value.dicts) ? [{ label: '选择常量', value: CONSTANT, children: [left.value.dicts] }] : options

  const handleChangeOperator = ({ label, charator }) => {
    dispatch({
      type: 'decisionSet/changeOperator',
      payload: {
        id,
        label,
        charator
      }
    })

    if (!right.id) {
      // 添加一个值类型选择
      dispatch({
        type: 'decisionSet/addValueTypeToCondition',
        payload: {
          id,
          parentId: null,
          position: RIGHT,
        }
      })
    }
  }

  // 操作符
  const operatorMenu = <Menu>
    {
      OPERATE.map(operator => {
        return <Menu.Item key={operator.charator}>
          <a onClick={() => handleChangeOperator({ label: operator.label, charator: operator.charator })}>{operator.label}</a>
        </Menu.Item>
      })
    }
  </Menu>

  // 值类型的值改变
  const handleExpressionChange = ({ parentId, valueId, type, value }, position) => {
    dispatch({
      type: 'decisionSet/setExpression',
      payload: {
        id: parentId,
        valueId,
        value,
        position: position,
        valueType: type,
      }
    })
      .then(() => {
        // 如果是函数，还得为参数添加值类型
        if (type === FUNC) {
          dispatch({
            type: 'decisionSet/addValueTypeToCondition',
            payload: {
              id: parentId,
              parentId: valueId,
              position
            }
          })
        }
      })
  }

  return (
    <div className={styles.display}>

      {left.id && <ValueSelect parentId={id} dispatch={dispatch} rawOptions={options} rawdata={left} options={options} constants={constants} onChange={(value) => handleExpressionChange(value, LEFT)} />}

      {left.type && <Dropdown overlay={operatorMenu} trigger={['click']}>
        <span style={{ color: 'red', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>&nbsp;{operator ? operator.label : '请选择操作符'}&nbsp;</span>
      </Dropdown>}

      {right.id && <ValueSelect parentId={id} rawOptions={options} dispatch={dispatch} rawdata={right} options={rightOptions} constants={constants} onChange={(value) => handleExpressionChange(value, RIGHT)} />}

      {operator && [OPERATE_CHATORATOR.in, OPERATE_CHATORATOR.NotIn].includes(operator.charator) && <span style={{ color: 'red', fontWeight: 700 }}>&nbsp;之中</span>}

      <Popconfirm title="确定删除当前条件？" onConfirm={() => onDelete(id, parentId)}>
        <span style={{ color: '#1890ff', cursor: 'pointer' }}>&nbsp;删&nbsp;除</span>
      </Popconfirm>
    </div>
  );
};

export default Condition;
