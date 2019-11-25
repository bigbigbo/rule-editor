import explorer from './explorer';
import tabs from './tabs';
import decisionSet from './decisionSet';

// 给每个 action 加上 namespace
function formatActions(namespace, actions) {
  return Object.keys(actions).reduce((acc, key) => {
    actions[key].namespace = namespace;
    acc[`${namespace}/${key}`] = actions[key];
    return acc;
  }, {});
}

export default {
  state: {
    [explorer.namespace]: { ...explorer.state },
    [tabs.namespace]: { ...tabs.state },
    [decisionSet.namespace]: { ...decisionSet.state }
  },
  effects: {
    ...formatActions(explorer.namespace, explorer.effects),
    ...formatActions(tabs.namespace, tabs.effects),
    ...formatActions(decisionSet.namespace, decisionSet.effects)
  },
  reducers: {
    ...formatActions(explorer.namespace, explorer.reducers),
    ...formatActions(tabs.namespace, tabs.reducers),
    ...formatActions(decisionSet.namespace, decisionSet.reducers)
  }
};
