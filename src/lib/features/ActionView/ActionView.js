import React from 'react';
import { Dropdown, Menu, Popconfirm } from 'antd'
import ValueSelect from '../ValueSelect'

import { INPUT, VARIABLE, CONSTANT, FUNC } from '../../constants/valueType'
import { VARIABLE_ASSIGN, EXECUTE_METHOD } from '../../constants/actionType'


const ActionView = (props) => {
  const { dispatch, position, actions = [], variables = [], constants = [], funcs = [] } = props;

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

  const handleAddAction = (position) => {
    dispatch({
      type: 'decisionSet/addAction',
      payload: {
        position
      }
    })
  }

  const handleDelete = (id, position) => {
    dispatch({
      type: 'decisionSet/deleteAction',
      payload: {
        id,
        position
      }
    })
  }


  const handleSetActionType = ({ id, type, position }) => {
    dispatch({
      type: 'decisionSet/setActionType',
      payload: {
        id,
        type,
        position
      }
    })
  }

  const handleActionValueChange = ({ parentId, valueId, type, value }, position) => {

    dispatch({
      type: 'decisionSet/setActionValue',
      payload: {
        id: parentId,
        valueId,
        position,
        value,
        valueType: type
      }
    })
      .then(() => {
        // 如果是函数，还得为参数添加值类型
        if (type === FUNC) {
          dispatch({
            type: 'decisionSet/addValueTypeToAction',
            payload: {
              id: parentId,
              parentId: valueId,
              position
            }
          })
        }
      })
  }


  const renderActionTypeLabel = (type) => {
    if (!type) return '请选择动作类型'

    if (type === VARIABLE_ASSIGN) return '变量赋值：'

    if (type === EXECUTE_METHOD) return '执行方法：'
  }

  const renderActionValue = ({ parentId, actionType, actionValueRawdata }) => {

    if (actionType === VARIABLE_ASSIGN) {
      const { left, right } = actionValueRawdata
      return <React.Fragment>
        <ValueSelect parentId={parentId} dispatch={dispatch} rawdata={left} rawOptions={options} options={options.slice(1, 2)} constants={constants} onChange={(value) => handleActionValueChange(value, position)} />
        <span style={{ color: 'red' }}>&nbsp;=&nbsp;</span>
        <ValueSelect parentId={parentId} dispatch={dispatch} rawdata={right} rawOptions={options} options={options} constants={constants} onChange={(value) => handleActionValueChange(value, position)} />
      </React.Fragment>
    }

    if (actionType === EXECUTE_METHOD) {
      return <ValueSelect defaultText="请选择方法" parentId={parentId} dispatch={dispatch} rawdata={actionValueRawdata} rawOptions={options} options={options.slice(3)} constants={constants} onChange={(value) => handleActionValueChange(value, position)} />
    }
  }

  return (
    <div>
      {
        actions.map(action => {
          const { id, type, value } = action;
          const actionTypeMenu = <Menu>
            <Menu.Item key={VARIABLE_ASSIGN}>
              <a onClick={() => { handleSetActionType({ id, position, type: VARIABLE_ASSIGN }) }}>变量赋值</a>
            </Menu.Item>
            <Menu.Item key={EXECUTE_METHOD}>
              <a onClick={() => { handleSetActionType({ id, position, type: EXECUTE_METHOD }) }}>执行方法</a>
            </Menu.Item>
          </Menu>

          return <div key={id}>
            <Dropdown overlay={actionTypeMenu} trigger={['click']}>
              <span style={{ color: 'green', cursor: 'pointer', outline: 'none' }}>{renderActionTypeLabel(type)}</span>
            </Dropdown>

            {renderActionValue({ parentId: id, actionType: type, actionValueRawdata: value })}

            <Popconfirm title="确定删除当前动作？" onConfirm={() => handleDelete(id, position)}>
              <span style={{ color: '#1890ff', cursor: 'pointer' }}>&nbsp;删&nbsp;除</span>
            </Popconfirm>
          </div>
        })
      }

      <div>
        <a onClick={() => handleAddAction(position)}>添加动作</a>
      </div>
    </div>
  );
};

export default ActionView;
