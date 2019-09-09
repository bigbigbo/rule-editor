import React from 'react';

import { Tabs } from 'antd';
import FreezeComponent from '../../components/FreezeComponent';
import DecisionSetEditor from './DecisionSetEditor';
import Welcomme from '../../components/Welcome';

// constants
import { LIB, DECISION_SET } from '../../constants/fileType';

// hooks
import useConnect from '../../store/useConnect';

import './styles/reset.scss';

const { TabPane } = Tabs;

const Tip = () => {
  return <h2 style={{ textAlign: 'center' }}>还未实现</h2>;
};

// 针对不同文件类型显示不同的编辑器
const Editors = {
  [LIB]: Tip,
  [DECISION_SET]: DecisionSetEditor
};

const EditorView = () => {
  const { tabs, activeKey, dispatch } = useConnect(state => ({ ...state.tabs }));

  function handleChange(activeKey) {
    dispatch({
      type: 'tabs/setActiveKey',
      payload: { activeKey }
    });
  }

  if (tabs.length === 0) {
    return <Welcomme />;
  }

  return (
    <Tabs type="editable-card" hideAdd activeKey={activeKey} onChange={handleChange}>
      {tabs.map(tab => {
        const Editor = Editors[tab.editorType];
        return (
          <TabPane tab={tab.title} key={tab.id}>
            <FreezeComponent freeze={tab.id !== activeKey}>
              <Editor id={tab.id}></Editor>
            </FreezeComponent>
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default EditorView;
