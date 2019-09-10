import React from 'react';

import { Cascader } from 'antd';
import InputType from './InputType'

import { INPUT, CONSTANT, VARIABLE, FUNC } from '../../constants/valueType'

const ValueSelect = (props) => {
  const { defaultText = '请选择值类型', dispatch, parentId, constants = [], rawOptions = [], options = [], rawdata = {}, onChange } = props;

  const { id, value, isInputType = false, isFuncType = false } = rawdata;

  // 更加不同的值类型显示不同的文本，如果是选择用户输入值时，则会出现一个输入框供用户输入
  const renderDisplayLabel = (rawdata) => {
    if (rawdata.isInputType) {
      return "修改值类型"
    }

    if (rawdata.isConstantType) {
      return rawdata.value.dictTypeLabel + (rawdata.value.label ? `.${rawdata.value.label}` : "")
    }

    if (rawdata.isVariableType) {
      return rawdata.value.groupLabel + (rawdata.value.propLabel ? `.${rawdata.value.propLabel}` : "")
    }

    if (rawdata.isFuncType) {
      return rawdata.value.methodLabel
    }
  }

  // 如果是选择函数类型，则应该还要渲染对应的参数
  const renderFuncParameters = (rawdata) => {
    const { parameters } = rawdata.value || {}

    return <span>({
      parameters.map(param => {
        return <span key={param.name}>{param.name}:{param.value && <ValueSelect id={param.value.id} parentId={parentId} rawOptions={rawOptions} options={rawOptions} dispatch={dispatch} constants={constants} rawdata={param.value} onChange={onChange} />};</span>
      })
    })</span>
  }

  const handleChange = (value, selectedOptions) => {

    const [valueType] = value;
    let standardValue;

    // 当直选了值类型而没有选择具体值的时候，不触发 onChange
    if (value.length === 1 && valueType !== INPUT) return

    if (valueType === INPUT) {
      standardValue = ""
    }

    if (valueType === CONSTANT) {
      const [, dictType, code] = value;
      const [, { label: dictTypeLabel } = {}, { label } = {}] = selectedOptions;
      const [dicts] = constants.filter(i => i.value === dictType); // 变量要带上字典给后端

      if (value.length === 2) {
        standardValue = {
          dicts,
          dictType,
          dictTypeLabel,
          code: "",
          label: ""
        }
      } else {
        standardValue = {
          dicts,
          dictType,
          dictTypeLabel,
          code,
          label
        }
      }

    }

    if (valueType === VARIABLE) {
      const dictType = selectedOptions[selectedOptions.length - 1].dictType;
      const [dicts] = constants.filter(i => i.value === dictType); // 变量要带上字典给后端

      if (value.length === 2) {
        standardValue = {
          dicts,
          groupCode: value[value.length - 1],
          groupLabel: selectedOptions[selectedOptions.length - 1].label,
          propCode: "",
          propLabel: ""
        }
      } else {
        standardValue = {
          dicts,
          groupCode: value.slice(1, value.length - 1),
          groupLabel: selectedOptions.slice(1, value.length - 1).map(i => i.label).join('.'),
          propCode: value[value.length - 1],
          propLabel: selectedOptions[selectedOptions.length - 1].label
        }
      }
    }

    if (valueType === FUNC) {
      // 必须选择具体函数才能操作
      if (value.length === 2) return;

      const [, actionName, methodName] = value;
      const { label, parameters } = selectedOptions[selectedOptions.length - 1]

      standardValue = {
        actionName,
        methodName,
        methodLabel: label,
        parameters
      }

    }

    onChange && onChange({
      parentId,
      valueId: id,
      type: valueType,
      value: standardValue,
    })
  }

  const handleInputTypeValueChange = ({ target: { value } }) => {
    onChange && onChange({
      parentId,
      valueId: id,
      type: INPUT,
      value,
    })
  }

  return (
    <React.Fragment>
      {isInputType && <InputType value={value} onChange={handleInputTypeValueChange} />}

      <Cascader changeOnSelect={true} options={options} onChange={handleChange}>
        <span style={{ color: 'blue', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>{rawdata.type ? renderDisplayLabel(rawdata) : defaultText}</span>
      </Cascader>

      {isFuncType && renderFuncParameters(rawdata)}

    </React.Fragment>
  );
};

export default ValueSelect;
