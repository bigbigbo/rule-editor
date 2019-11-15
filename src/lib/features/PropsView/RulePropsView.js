/* eslint-disable eqeqeq */
import React, { useState } from 'react';
import { Form, Input, Switch, Button, Modal } from 'antd';

import { CONDITION_RULE, LOOP_RULE } from '../../constants/ruleType';
import { IS_PUBLIC_RULE, NO_PUBLIC_RULE } from '../../constants/rulePublic';

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
  const { disabled = false, saveLoading = false, attrs = {}, dispatch, onSubmit, onCancel } = props;

  const [nameFieldError, setNameFieldError] = useState();
  const [fieldDirtyMap, setFieldDirtyMap] = useState({});

  const handleFieldValueChange = (fieldName, value) => {
    // 校验规则名称的合法性，回头在优化吧
    if (fieldName === 'name') {
      if (value.startsWith('_')) {
        setNameFieldError('规则名称不能以下划线开头');
      } else if (value.length === 0) {
        setNameFieldError('规则名称不能为空，最长可以输入24个字符');
      } else {
        setNameFieldError(null);
      }
    }

    dispatch({
      type: 'decisionSet/setAttr',
      payload: {
        fieldName,
        value
      }
    });

    setFieldDirtyMap({
      ...fieldDirtyMap,
      [fieldName]: true
    });
  };

  const handleSubmit = () => {
    if (nameFieldError) {
      return;
    }

    onSubmit && onSubmit();
  };

  const handleCancel = () => {
    if (disabled) {
      if (typeof onCancel === 'function') {
        onCancel();
      }
      return;
    }

    Modal.confirm({
      title: '您还未保存内容，确定返回吗？',
      onOk() {
        if (typeof onCancel === 'function') {
          onCancel();
        }
      }
    });
  };

  return (
    <React.Fragment>
      <Form {...formItemLayout}>
        <Form.Item
          label="规则名称"
          required
          hasFeedback
          validateStatus={!fieldDirtyMap.name ? undefined : nameFieldError ? 'error' : 'success'}
          help={nameFieldError}
        >
          <Input
            disabled={disabled}
            maxLength={24}
            placeholder="请输入规则名称"
            value={attrs.name}
            onChange={e => handleFieldValueChange('name', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="备注">
          <Input.TextArea
            disabled={disabled}
            rows={5}
            maxLength={140}
            placeholder="请输入备注"
            value={attrs.remark}
            onChange={e => handleFieldValueChange('remark', e.target.value)}
          />
          <p style={{ textAlign: 'right', lineHeight: '24px', margin: 0 }}>
            还能输入<span style={{ color: 'red' }}>{140 - attrs.remark.length}</span>个字
          </p>
        </Form.Item>
        <Form.Item label="是否公共规则">
          <Switch
            disabled={disabled}
            checked={attrs.ruleIsPublic == IS_PUBLIC_RULE}
            onChange={e => handleFieldValueChange('ruleIsPublic', e ? IS_PUBLIC_RULE : NO_PUBLIC_RULE)}
          />
        </Form.Item>
        <Form.Item label="是否循环规则">
          <Switch
            disabled={disabled}
            checked={attrs.ruleType == LOOP_RULE}
            onChange={e => handleFieldValueChange('ruleType', e ? LOOP_RULE : CONDITION_RULE)}
          />
        </Form.Item>
      </Form>
      {!disabled && (
        <Button
          type="primary"
          size="large"
          style={{ width: '100%', marginBottom: 16 }}
          onClick={handleSubmit}
          loading={saveLoading}
        >
          {saveLoading ? '保存中' : '保存'}
        </Button>
      )}
      <Button size="large" style={{ width: '100%' }} onClick={handleCancel}>
        返回
      </Button>
    </React.Fragment>
  );
};

export default RulePropsView;
