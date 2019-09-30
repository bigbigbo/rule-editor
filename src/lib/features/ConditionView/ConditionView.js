import React from 'react';
import { Modal } from 'antd';
import UniteCondition from './UniteCondition'
import Condition from './Condition'

const ConditionView = (props) => {
  const { disabled = false, rootCondition = {}, dispatch, constants = [], variables = [], funcs = [] } = props;

  const handleChanageConditionType = (id, type) => {
    dispatch({
      type: 'decisionSet/changeConditionType',
      payload: {
        id,
        type
      }
    });
  };

  const handleAddCondition = (id, type) => {
    dispatch({
      type: 'decisionSet/addCondition',
      payload: {
        id,
        type
      }
    });
  };

  const handleDeleteUniteCondition = (id, parentId) => {
    Modal.confirm({
      title: '确定删除当前条件以及它的子条件吗？',
      okType: 'danger',
      onOk() {
        dispatch({
          type: 'decisionSet/deleteCondition',
          payload: {
            id,
            parentId
          }
        });
      }
    });
  };

  const handleonDelete = (id, parentId) => {
    dispatch({
      type: 'decisionSet/deleteCondition',
      payload: {
        id,
        parentId
      }
    });
  };

  const renderSubCondition = (conditions, parentId) => {
    return conditions.map(condition => {
      const { id, isAndType, isNormalType, subConditions = [] } = condition;

      if (isNormalType) {
        return <Condition
          key={id}
          id={id}
          disabled={disabled}
          parentId={parentId}
          rootCondition={rootCondition}
          constants={constants}
          variables={variables}
          funcs={funcs}
          dispatch={dispatch}
          onDelete={handleonDelete}
        />;
      }

      return (
        <UniteCondition
          key={id}
          id={id}
          disabled={disabled}
          parentId={parentId}
          isAndType={isAndType}
          onChanageConditionType={handleChanageConditionType}
          onAddCondition={handleAddCondition}
          onDelete={handleDeleteUniteCondition}
        >
          {renderSubCondition(subConditions, id)}
        </UniteCondition>
      );
    });
  };

  return (
    <UniteCondition
      id={rootCondition.id}
      isRoot={true}
      disabled={disabled}
      isAndType={rootCondition.isAndType}
      onChanageConditionType={handleChanageConditionType}
      onAddCondition={handleAddCondition}
    >
      {renderSubCondition(rootCondition.subConditions, rootCondition.id)}
    </UniteCondition>
  );
};

export default ConditionView;
