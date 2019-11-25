import produce from 'immer';
export default {
  namespace: 'tabs',
  state: {
    activeKey: 'file_0',
    tabs: [
      {
        editorType: 'decisionSet',
        id: 'file_0',
        title: 'demo.rx.xml'
      }
    ]
  },
  effects: {},
  reducers: {
    push(state, { payload }) {
      const { tabs } = state;
      const { id, title, editorType } = payload;

      return produce(state, draft => {
        if (tabs.findIndex(i => i.id === id) !== -1) {
          // 如果已经在tabs显示，则激活该tab
          draft.activeKey = id;
        } else {
          // 否则则加入 tabs
          draft.tabs.push({ id, title, editorType });
          draft.activeKey = id;
        }
      });
    },

    setActiveKey(state, { payload }) {
      const { activeKey } = payload;

      return produce(state, draft => {
        state.activeKey = activeKey;
      });
    }
  }
};
