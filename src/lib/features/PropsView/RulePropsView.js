import React from 'react';
import { Form, Input, Switch } from 'antd';

import { CONDITION_RULE, LOOP_RULE } from '../../constants/ruleType'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

const RulePropsView = props => {
  const { attrs = {}, dispatch } = props;


  const handleFieldValueChange = (fieldName, value) => {
    dispatch({
      type: 'decisionSet/setAttr',
      payload: {
        fieldName,
        value
      }
    })
  }

  return (
    <React.Fragment>
      <Form {...formItemLayout}>
        <Form.Item label="规则名称"><Input placeholder="请输入规则名称" value={attrs.name} onChange={(e) => handleFieldValueChange('name', e.target.value)} /></Form.Item>
        <Form.Item label="备注"><Input.TextArea placeholder="请输入备注" value={attrs.remark} onChange={(e) => handleFieldValueChange('remark', e.target.value)} /></Form.Item>
        <Form.Item label="是否启用"><Switch checked={attrs.enabled} onChange={(e) => handleFieldValueChange('enabled', e)} /></Form.Item>
        <Form.Item label="是否循环规则">
          <Switch checked={attrs.ruleType === LOOP_RULE} onChange={(e) => handleFieldValueChange('ruleType', e ? LOOP_RULE : CONDITION_RULE)} />
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default RulePropsView
