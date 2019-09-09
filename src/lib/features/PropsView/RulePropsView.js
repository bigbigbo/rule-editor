import React from 'react';
import { Form, Input, Switch } from 'antd';

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
  const { form } = props;
  const { getFieldDecorator } = form;
  return (
    <React.Fragment>
      <Form {...formItemLayout}>
        <Form.Item label="规则名称">{getFieldDecorator('ruleName')(<Input placeholder="请输入规则名称" />)}</Form.Item>
        <Form.Item label="备注">{getFieldDecorator('remark')(<Input.TextArea placeholder="请输入备注" />)}</Form.Item>
        <Form.Item label="是否启用">{getFieldDecorator('enabled', { valuePropName: 'checked' })(<Switch />)}</Form.Item>
        {/* <Form.Item label="优先级">
          {getFieldDecorator('priority')(<Input type="number" placeholder="请输入优先级" />)}
        </Form.Item>
        <Form.Item label="生效日期">{getFieldDecorator('effectDate')(<DatePicker />)}</Form.Item>
        <Form.Item label="失效日期">{getFieldDecorator('expiryDate')(<DatePicker />)}</Form.Item>
        <Form.Item label="互斥组">{getFieldDecorator('mutexGroup')(<Input placeholder="请输入互斥组" />)}</Form.Item>
        <Form.Item label="执行组">{getFieldDecorator('executeGroup')(<Input placeholder="请输入执行组" />)}</Form.Item> */}
        <Form.Item label="自动获取焦点">
          {getFieldDecorator('autoFocus', { valuePropName: 'checked' })(<Switch />)}
        </Form.Item>
        <Form.Item label="循环触发">
          {getFieldDecorator('cycleEnabled', { valuePropName: 'checked' })(<Switch />)}
        </Form.Item>
        <Form.Item label="调试信息输出">
          {getFieldDecorator('logEnabled', {
            valuePropName: 'checked'
          })(<Switch />)}
        </Form.Item>
      </Form>
      {/* <Button type="danger" size="large" style={{ width: '100%' }}>
        删&nbsp;除
      </Button> */}
    </React.Fragment>
  );
};

export default Form.create()(RulePropsView);
