import produce, { immerable } from 'immer';
import md5 from 'md5';

import { AND, OR, NORMAL } from '../../constants/conditionType';
import { INPUT, CONSTANT, VARIABLE, FUNC } from '../../constants/valueType'
import { VARIABLE_ASSIGN, EXECUTE_METHOD } from '../../constants/actionType'
import { getNode, getValueType } from '../../utils/decisionSet'

export class Condition {
  constructor(props) {
    this.id = props.id;
    this.type = props.type;

    if (this.isNormalType) {
      this.expression = {};
      if (props.expression.left) {
        this.expression.left = new ValueType(props.expression.left)
      }
      if (props.expression.operator) {
        this.expression.operator = props.expression.operator
      }
      if (props.expression.right) {
        this.expression.right = new ValueType(props.expression.right)
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

export class ActionType {
  constructor({ id, type, value }) {
    this.id = id;
    this.type = type;
    this.value = this.init(value)
  }

  [immerable] = true;

  init(value) {
    if (!this.type) return {}

    if (this.type === VARIABLE_ASSIGN) {
      return {
        left: new ValueType(value.left),
        right: new ValueType(value.right)
      }
    }

    if (this.type === EXECUTE_METHOD) {
      return new ValueType(value)
    }

  }
}

export class ValueType {
  constructor({ id, type, value }) {
    this.id = id;
    this.type = type
    this.value = this.init(value)
  }

  [immerable] = true;

  get isInputType() {
    return this.type === INPUT
  }

  get isConstantType() {
    return this.type === CONSTANT
  }

  get isVariableType() {
    return this.type === VARIABLE
  }

  get isFuncType() {
    return this.type === FUNC
  }

  getValue() {
    return {
      type: this.type,
      value: this.value
    }
  }

  init(value) {
    if (!this.type) return {}

    if (this.type === INPUT) {
      return value
    }

    if (this.type === CONSTANT) {
      return {
        dicts: value.dicts, // 该字典元数据
        dictType: value.dictType, // 字典类型
        dictTypeLabel: value.dictTypeLabel,
        code: value.code, // 字典码值
        label: value.label
      }
    }

    if (this.type === VARIABLE) {
      return {
        dicts: value.dicts,
        groupCode: value.groupCode,
        groupLabel: value.groupLabel,
        propCode: value.propCode,
        propLabel: value.propLabel
      }
    }

    if (this.type === FUNC) {
      return {
        actionName: value.actionName,
        methodName: value.methodName,
        methodLabel: value.methodLabel,
        parameters: value.parameters.map(param => {
          param.value = new ValueType(param.value)
          return param
        })
      }
    }
  }
}

// 设置初始状态
export function setInitialValue(data) {
  if (!data) return {}
  return produce(data, draft => {
    draft.rootCondition.subConditions = draft.rootCondition.subConditions.map(condition => {

      return new Condition(condition)
    });

    draft.trueActions = draft.trueActions.map(action => {
      return new ActionType(action)
    })

    draft.falseActions = draft.falseActions.map(action => {
      return new ActionType(action)
    })
  })
}

export default {
  namespace: 'decisionSet',
  state: {
    attrs: {
      name: '测试规则1',
      remark: '作测试规则使用',
      enabled: true
    },
    rootCondition: new Condition({
      id: 'ROOT',
      type: 'and',
      subConditions: []
    }),

    trueActions: [
      // {
      //   type: 'variableAssign',
      //   value: {
      //     left: new ValueType(md5('' + Date.now() + Math.random()), null),
      //     right: new ValueType(md5('' + Date.now() + Math.random()), null)
      //   }
      // }
    ],

    falseActions: [
      // {
      //   type: 'executeMethod',
      //   value: new ValueType(md5('' + Date.now() + Math.random()), null)
      // }
    ]
  },
  effects: {},
  reducers: {
    // 设置初始值
    setInitialValue(state, { payload }) {
      const { initialValue } = payload

      return { ...initialValue }
    },

    // 设置规则属性
    setAttr(state, { payload }) {
      const { fieldName, value } = payload;

      return produce(state, draft => {
        draft.attrs[fieldName] = value
      })
    },

    // 改变联合条件类型
    changeConditionType(state, { payload }) {
      const { id, type } = payload;
      return produce(state, drfat => {
        const target = getNode([drfat.rootCondition], id);
        target.type = type;
      });
    },

    // 添加一个条件或者联合条件
    addCondition(state, { payload }) {
      const { id, type, ...restProps } = payload;
      const newConditionId = md5('' + Date.now() + Math.random());

      return produce(state, draft => {
        const target = getNode([draft.rootCondition], id);

        // 添加条件后添加expression.left
        const expression = {
          // left: new ValueType({ id: md5('' + Date.now() + Math.random()), type: null })
          left: { id: md5('' + Date.now() + Math.random()), type: null }
        }
        target.subConditions.push(new Condition({ id: newConditionId, type, expression: expression, ...restProps }));
      });
    },

    // 删除条件
    deleteCondition(state, { payload }) {
      const { id, parentId } = payload;

      return produce(state, draft => {
        if (parentId) {
          const target = getNode([draft.rootCondition], parentId);
          const deleteIndex = target.subConditions.findIndex(item => item.id === id);

          target.subConditions.splice(deleteIndex, 1);
        }
      });
    },

    // 设置表达式的 left 和 right
    setExpression(state, { payload }) {
      const { id, position, valueId, valueType, value } = payload;

      return produce(state, draft => {
        const target = getNode([draft.rootCondition], id)

        const valueTypeModel = getValueType([target.expression[position]], valueId)

        valueTypeModel.type = valueType;
        valueTypeModel.value = value;
      })
    },

    // 改变操作符
    changeOperator(state, { payload }) {
      const { id, label, charator } = payload

      return produce(state, draft => {
        const target = getNode([draft.rootCondition], id)
        target.expression.operator = {
          label,
          charator
        }
        // TODO: 看是否需要修改
        if (target.expression.right) {
          target.expression.right.type = null;
          target.expression.right.value = null;
        }
      })
    },

    // 添加一个值选择
    addValueTypeToCondition(state, { payload }) {
      const { id, parentId, position } = payload

      return produce(state, draft => {
        const target = getNode([draft.rootCondition], id)

        // 只有函数参数才存在继续添加值类型的情况
        if (parentId) {
          const valueTypeModel = getValueType([target.expression[position]], parentId);
          valueTypeModel.value.parameters.forEach(param => {
            param.value = new ValueType({ id: md5('' + Date.now() + Math.random()), type: null })
          })
        } else {
          target.expression[position] = new ValueType({ id: md5('' + Date.now() + Math.random()), type: null })
        }
      })
    },

    // 添加一个动作
    addAction(state, { payload }) {
      const { position } = payload;

      return produce(state, draft => {
        const target = draft[position];
        target.push(new ActionType({ id: md5('' + Date.now() + Math.random()), type: null }))
      })
    },

    // 删除一个动作
    deleteAction(state, { payload }) {
      const { id, position } = payload;

      return produce(state, draft => {
        const target = draft[position];

        const deleteIndex = target.findIndex(item => item.id === id);

        target.splice(deleteIndex, 1);
      })
    },

    // 设置动作类型：变量赋值或者执行方法
    setActionType(state, { payload }) {
      const { id, type, position } = payload

      return produce(state, draft => {
        const target = draft[position].find(item => item.id === id);

        target.type = type

        if (type === VARIABLE_ASSIGN) {
          target.value = {
            left: new ValueType({ id: md5('' + Date.now() + Math.random()), type: null }),
            right: new ValueType({ id: md5('' + Date.now() + Math.random()), type: null }),
          }
        }

        if (type === EXECUTE_METHOD) {
          target.value = new ValueType({ id: md5('' + Date.now() + Math.random()), type: null })
        }
      })
    },

    // 改变动作的值
    setActionValue(state, { payload }) {
      const { id, position, valueId, valueType, value } = payload;

      return produce(state, draft => {
        const target = draft[position].find(item => item.id === id)

        let valueTypeModel

        if (target.type === VARIABLE_ASSIGN) {
          valueTypeModel = getValueType([target.value.left, target.value.right], valueId)
        }

        if (target.type === EXECUTE_METHOD) {
          valueTypeModel = getValueType([target.value], valueId)
        }

        valueTypeModel.type = valueType;
        valueTypeModel.value = value;

      })
    },

    // 为动作的函数添加值类型
    addValueTypeToAction(state, { payload }) {
      const { id, parentId, position } = payload

      return produce(state, draft => {
        const target = draft[position].find(item => item.id === id)

        // 只有函数参数才存在继续添加值类型的情况
        if (parentId) {

          let valueTypeModel

          if (target.type === VARIABLE_ASSIGN) {
            valueTypeModel = getValueType([target.value.left, target.value.right], parentId)
          }

          if (target.type === EXECUTE_METHOD) {
            valueTypeModel = getValueType([target.value], parentId)
          }
          valueTypeModel.value.parameters.forEach(param => {
            param.value = new ValueType({ id: md5('' + Date.now() + Math.random()), type: null })
          })
        }
      })
    }
  }
};
