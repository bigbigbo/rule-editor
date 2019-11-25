import produce, { immerable } from 'immer';
import md5 from 'md5';

import { AND, OR, NORMAL } from '../../constants/conditionType';
import { INPUT, CONSTANT, VARIABLE, FUNC } from '../../constants/valueType';
import { VARIABLE_ASSIGN, EXECUTE_METHOD } from '../../constants/actionType';
import { CONDITION_RULE } from '../../constants/ruleType';
import { NO_PUBLIC_RULE } from '../../constants/rulePublic';
import { getNode, getValueType } from '../../utils/decisionSet';

class Condition {
  constructor(props) {
    this.id = props.id;
    this.type = props.type;

    if (this.isNormalType) {
      this.expression = {};
      if (props.expression.left) {
        this.expression.left = new ValueType(props.expression.left);
      }
      if (props.expression.operator) {
        this.expression.operator = props.expression.operator;
      }
      if (props.expression.right) {
        this.expression.right = new ValueType(props.expression.right);
      }
    } else {
      this.subConditions = Array.isArray(props.subConditions)
        ? props.subConditions.map(options => new Condition(options))
        : [];
    }
  }

  [immerable] = true;

  get isAndType() {
    return this.type === AND;
  }

  get isOrType() {
    return this.type === OR;
  }

  get isNormalType() {
    return this.type === NORMAL;
  }
}

class ActionType {
  constructor({ id, type, value }) {
    this.id = id;
    this.type = type;
    this.value = this.init(value);
  }

  [immerable] = true;

  init(value) {
    if (!this.type) return {};

    if (this.type === VARIABLE_ASSIGN) {
      return {
        left: new ValueType(value.left),
        right: new ValueType(value.right)
      };
    }

    if (this.type === EXECUTE_METHOD) {
      return new ValueType(value);
    }
  }
}

class ValueType {
  constructor({ id, type, value }) {
    this.id = id;
    this.type = type;
    this.value = this.init(value);
  }

  [immerable] = true;

  get isInputType() {
    return this.type === INPUT;
  }

  get isConstantType() {
    return this.type === CONSTANT;
  }

  get isVariableType() {
    return this.type === VARIABLE;
  }

  get isFuncType() {
    return this.type === FUNC;
  }

  getValue() {
    return {
      type: this.type,
      value: this.value
    };
  }

  init(value) {
    if (!this.type) return {};

    if (this.type === INPUT) {
      return value;
    }

    if (this.type === CONSTANT) {
      return {
        dicts: value.dicts, // 该字典元数据
        dictType: value.dictType, // 字典类型
        dictTypeLabel: value.dictTypeLabel,
        code: value.code, // 字典码值
        label: value.label
      };
    }

    if (this.type === VARIABLE) {
      return {
        dicts: value.dicts,
        groupCode: value.groupCode,
        groupLabel: value.groupLabel,
        propCode: value.propCode,
        propLabel: value.propLabel
      };
    }

    if (this.type === FUNC) {
      return {
        actionName: value.actionName,
        methodName: value.methodName,
        methodLabel: value.methodLabel,
        parameters: value.parameters.map(param => {
          param.value = new ValueType(param.value);
          return param;
        })
      };
    }
  }
}

const START_ACTIONS = 'startActions';
const END_ACTIONS = 'endActions';

const initialState = {
  attrs: {
    name: '',
    remark: '',
    enabled: true,
    ruleType: CONDITION_RULE,
    ruleIsPublic: NO_PUBLIC_RULE
  },

  // 规则
  conditionRules: [
    {
      id: 1,
      name: '判断单元',
      rootCondition: new Condition({
        id: 'ROOT',
        type: AND,
        subConditions: []
      }),

      // 那么动作
      trueActions: [
        // {
        //   type: 'variableAssign',
        //   value: {
        //     left: new ValueType(md5('' + Date.now() + Math.random()), null),
        //     right: new ValueType(md5('' + Date.now() + Math.random()), null)
        //   }
        // }
      ],

      // 否则动作
      falseActions: [
        // {
        //   type: 'executeMethod',
        //   value: new ValueType(md5('' + Date.now() + Math.random()), null)
        // }
      ]
    }
  ],

  // 循环对象
  loopTarget: new ValueType({ id: 'loopTarget', type: null }),

  // 循环规则-开始前动作
  startActions: [],

  // 循环规则-结束时动作
  endActions: []
};

// 设置初始状态
export function setInitialValue(data) {
  if (!data) return initialState;

  return produce(data, draft => {
    draft.conditionRules.forEach(rule => {
      rule.rootCondition = new Condition(rule.rootCondition);

      rule.trueActions = rule.trueActions.map(action => {
        return new ActionType(action);
      });

      rule.falseActions = rule.falseActions.map(action => {
        return new ActionType(action);
      });
    });

    draft.loopTarget = new ValueType(draft.loopTarget);

    draft.startActions = draft.startActions.map(action => {
      return new ActionType(action);
    });

    draft.endActions = draft.endActions.map(action => {
      return new ActionType(action);
    });
  });
}

export default {
  namespace: 'decisionSet',
  state: initialState,
  effects: {},
  reducers: {
    // 设置规则属性
    setAttr(state, { payload }) {
      const { fieldName, value } = payload;

      return produce(state, draft => {
        draft.attrs[fieldName] = value;

        if (fieldName === 'ruleType' && value === CONDITION_RULE) {
          draft.conditionRules = draft.conditionRules.slice(0, 1);
        }
      });
    },

    // 设置循环对象
    setLoopTarget(state, { payload }) {
      const { valueId, value, valueType } = payload;

      return produce(state, draft => {
        const target = draft.loopTarget;

        const valueTypeModel = getValueType([target], valueId);

        valueTypeModel.type = valueType;
        valueTypeModel.value = value;
      });
    },

    // 当循环对象的时候添加单元判断条件
    addUnitRule(state) {
      return produce(state, draft => {
        draft.conditionRules.push({
          id: md5('' + Date.now() + Math.random()),
          rootCondition: new Condition({
            id: md5('' + Date.now() + Math.random()),
            type: AND,
            subConditions: []
          }),
          trueActions: [],
          falseActions: []
        });
      });
    },

    // 改变循环对象中单元判断的名称
    setUnitRuleName(state, { payload }) {
      const { id, name } = payload;

      return produce(state, draft => {
        const target = draft.conditionRules.find(i => i.id === id);
        target.name = name;
      });
    },

    // 删除判断单元
    deleteUnitRule(state, { payload }) {
      const { id } = payload;

      return produce(state, draft => {
        const deleteIndex = draft.conditionRules.findIndex(i => i.id === id);

        draft.conditionRules.splice(deleteIndex, 1);
      });
    },

    // 改变联合条件类型
    changeConditionType(state, { payload }) {
      const { id, type } = payload;

      return produce(state, draft => {
        const target = getNode(draft.conditionRules.map(i => i.rootCondition), id);
        target.type = type;
      });
    },

    // 添加一个条件或者联合条件
    addCondition(state, { payload }) {
      const { id, type, ...restProps } = payload;
      const newConditionId = md5('' + Date.now() + Math.random());

      return produce(state, draft => {
        const target = getNode(draft.conditionRules.map(i => i.rootCondition), id);

        // 添加条件后添加expression.left
        const expression = {
          // left: new ValueType({ id: md5('' + Date.now() + Math.random()), type: null })
          left: { id: md5('' + Date.now() + Math.random()), type: null }
        };
        target.subConditions.push(new Condition({ id: newConditionId, type, expression: expression, ...restProps }));
      });
    },

    // 删除条件
    deleteCondition(state, { payload }) {
      const { id, parentId } = payload;

      return produce(state, draft => {
        if (parentId) {
          const target = getNode(draft.conditionRules.map(i => i.rootCondition), parentId);
          const deleteIndex = target.subConditions.findIndex(item => item.id === id);

          target.subConditions.splice(deleteIndex, 1);
        }
      });
    },

    // 设置表达式的 left 和 right
    setExpression(state, { payload }) {
      const { id, position, valueId, valueType, value } = payload;

      return produce(state, draft => {
        const target = getNode(draft.conditionRules.map(i => i.rootCondition), id);

        const valueTypeModel = getValueType([target.expression[position]], valueId);

        valueTypeModel.type = valueType;
        valueTypeModel.value = value;
      });
    },

    // 改变操作符
    changeOperator(state, { payload }) {
      const { id, label, charator } = payload;

      return produce(state, draft => {
        const target = getNode(draft.conditionRules.map(i => i.rootCondition), id);
        target.expression.operator = {
          label,
          charator
        };
        // TODO: 看是否需要修改
        if (target.expression.right) {
          target.expression.right.type = null;
          target.expression.right.value = null;
        }
      });
    },

    // 添加一个值选择
    addValueTypeToCondition(state, { payload }) {
      const { id, parentId, position } = payload;

      return produce(state, draft => {
        const target = getNode(draft.conditionRules.map(i => i.rootCondition), id);

        // 只有函数参数才存在继续添加值类型的情况
        if (parentId) {
          const valueTypeModel = getValueType([target.expression[position]], parentId);
          valueTypeModel.value.parameters.forEach(param => {
            param.value = new ValueType({ id: md5('' + Date.now() + Math.random()), type: null });
          });
        } else {
          target.expression[position] = new ValueType({ id: md5('' + Date.now() + Math.random()), type: null });
        }
      });
    },

    // 添加一个动作
    addAction(state, { payload }) {
      const { ruleId, position } = payload;

      return produce(state, draft => {
        let target;

        if ([START_ACTIONS, END_ACTIONS].includes(position)) {
          target = draft[position];
        } else {
          const rule = draft.conditionRules.find(i => i.id === ruleId);
          target = rule[position];
        }

        target.push(new ActionType({ id: md5('' + Date.now() + Math.random()), type: null }));
      });
    },

    // 删除一个动作
    deleteAction(state, { payload }) {
      const { ruleId, id, position } = payload;

      return produce(state, draft => {
        let target;

        if ([START_ACTIONS, END_ACTIONS].includes(position)) {
          target = draft[position];
        } else {
          const rule = draft.conditionRules.find(i => i.id === ruleId);
          target = rule[position];
        }

        const deleteIndex = target.findIndex(item => item.id === id);

        target.splice(deleteIndex, 1);
      });
    },

    // 设置动作类型：变量赋值或者执行方法
    setActionType(state, { payload }) {
      const { ruleId, id, type, position } = payload;

      return produce(state, draft => {
        let target;

        if ([START_ACTIONS, END_ACTIONS].includes(position)) {
          target = draft[position].find(item => item.id === id);
        } else {
          const rule = draft.conditionRules.find(i => i.id === ruleId);
          target = rule[position].find(item => item.id === id);
        }

        target.type = type;

        if (type === VARIABLE_ASSIGN) {
          target.value = {
            left: new ValueType({ id: md5('' + Date.now() + Math.random()), type: null }),
            right: new ValueType({ id: md5('' + Date.now() + Math.random()), type: null })
          };
        }

        if (type === EXECUTE_METHOD) {
          target.value = new ValueType({ id: md5('' + Date.now() + Math.random()), type: null });
        }
      });
    },

    // 改变动作的值
    setActionValue(state, { payload }) {
      const { ruleId, id, position, valueId, valueType, value } = payload;

      return produce(state, draft => {
        let target;

        if ([START_ACTIONS, END_ACTIONS].includes(position)) {
          target = draft[position].find(item => item.id === id);
        } else {
          const rule = draft.conditionRules.find(i => i.id === ruleId);
          target = rule[position].find(item => item.id === id);
        }

        let valueTypeModel;

        if (target.type === VARIABLE_ASSIGN) {
          valueTypeModel = getValueType([target.value.left, target.value.right], valueId);
        }

        if (target.type === EXECUTE_METHOD) {
          valueTypeModel = getValueType([target.value], valueId);
        }

        valueTypeModel.type = valueType;
        valueTypeModel.value = value;
      });
    },

    // 为动作的函数添加值类型
    addValueTypeToAction(state, { payload }) {
      const { ruleId, id, parentId, position } = payload;

      return produce(state, draft => {
        let target;

        if ([START_ACTIONS, END_ACTIONS].includes(position)) {
          target = draft[position].find(item => item.id === id);
        } else {
          const rule = draft.conditionRules.find(i => i.id === ruleId);
          target = rule[position].find(item => item.id === id);
        }

        // 只有函数参数才存在继续添加值类型的情况
        if (parentId) {
          let valueTypeModel;

          if (target.type === VARIABLE_ASSIGN) {
            valueTypeModel = getValueType([target.value.left, target.value.right], parentId);
          }

          if (target.type === EXECUTE_METHOD) {
            valueTypeModel = getValueType([target.value], parentId);
          }
          valueTypeModel.value.parameters.forEach(param => {
            param.value = new ValueType({ id: md5('' + Date.now() + Math.random()), type: null });
          });
        }
      });
    }
  }
};
