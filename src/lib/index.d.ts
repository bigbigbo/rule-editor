import * as React from 'react';

type ParamType = 'String' | 'Date';

interface Prop {
  label: string;
  code: string;
  childProps: Prop[] | null;
}

interface Variable {
  label: string;
  code: string;
  desc: string;
  props: Prop[];
}

interface Constant {
  label: string;
  code: string;
  dicts: Array<{ label: string; code: string }>;
}

interface Func {
  name: string;
  id: string;
  methods: Method[];
}

interface Method {
  methodName: string;
  name: string;
  parameters: Array<{ name: string; type: string }> | null;
}

export interface RuleEditorProps {
  variables: Variable[];
  constants: Constant[];
  funcs: Func[];
}

const RuleEditor: React.FC<RuleEditorProps> = () => {};

export default RuleEditor;
