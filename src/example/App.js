import React from "react";
import RuleEditor from "../lib";

const mockFuncs = [
  {
    label: '日期',
    value: 'date.action',
    id: 'date.action',
    children: [
      {
        value: 'format',
        label: '格式化日期',
        parameters: [
          { name: '目标日期', type: 'Date' },
          { name: '格式', type: 'String' },
        ]
      },
      {
        value: 'getDate',
        label: '当前日期',
        parameters: []
      },
      {
        value: 'addDateForDay',
        label: '日期加天',
        parameters: [
          { name: '目标日期', type: 'Date' },
          { name: '加几天', type: 'Number' },
        ]
      }
    ]
  }
]

const mockVariables = [
  {
    label: '客户',
    value: 'kehu',
    desc: '描述客户的一些信息',
    children: [
      { label: '年龄', value: 'nianling', dictType: "" },
      { label: '性别', value: 'xingbie', dictType: "sex" },
      { label: '婚否', value: 'hunfou', dictType: "" },
      {
        label: '订单', value: '_dingdan', children: [
          { label: '数量', value: '_shuliang' },
          { label: '名称', value: '_mingcheng' },
          { label: '价格', value: '_jiage' },
        ]
      }
    ]
  },
  {
    label: '订单',
    value: 'dingdan',
    desc: '描述订单的一些信息',
    children: [
      { label: '数量', value: 'shuliang' },
      { label: '名称', value: 'mingcheng' },
      { label: '价格', value: 'jiage' },
    ]
  }
]

const mockConstants = [
  {
    label: '性别',
    value: 'sex',
    children: [
      { label: '男', value: '1' },
      { label: '女', value: '0' }
    ]
  }
]

const App = () => {
  return <RuleEditor constants={mockConstants} variables={mockVariables} funcs={mockFuncs}></RuleEditor>;
};

export default App;
