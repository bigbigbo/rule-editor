import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import Provider from './store';
import { Layout, Sider, Content } from './components/Layout';
import ExplorerView from './features/ExplorerView';
import EditorView from './features/EditorView';

const RuleEditor = props => {
  const { constants, variables, funcs } = props;

  return (
    <ConfigProvider locale={zhCN}>
      <Provider constants={constants} variables={variables} funcs={funcs}>
        <Layout>
          <Sider>
            <ExplorerView />
          </Sider>
          <Content>
            <EditorView />
          </Content>
        </Layout>
      </Provider>
    </ConfigProvider>
  );
};

export default RuleEditor;
