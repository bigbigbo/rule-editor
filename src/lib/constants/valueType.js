export const INPUT = 'input';

export const VARIABLE = 'variable';

export const CONSTANT = 'constant';

export const FUNC = 'func';

export const OPERATE_CHATORATOR = {
  '==': '==',
  EqualsIgnoreCase: 'EqualsIgnoreCase',
  '!=': '!=',
  NotEqualsIgnoreCase: 'NotEqualsIgnoreCase',
  '<': '<',
  '<=': '<=',
  '>': '>',
  '>=': '>=',
  in: 'in',
  NotIn: 'NotIn',
  StartWith: 'StartWith',
  NotStartWith: 'NotStartWith',
  EndWith: 'EndWith',
  NotEndWith: 'NotEndWith',
  Null: 'Null',
  NotNull: 'NotNull',
  Match: 'Match',
  NotMatch: 'NotMatch',
  Contain: 'Contain',
  NotContain: 'NotContain'
};

export const OPERATE = [
  {
    label: '等于',
    charator: OPERATE_CHATORATOR['==']
  },
  {
    label: '等于（不区分大小写）',
    charator: OPERATE_CHATORATOR['EqualsIgnoreCase']
  },
  {
    label: '不等于',
    charator: OPERATE_CHATORATOR['!=']
  },
  {
    label: '不等于（不区分大小写）',
    charator: OPERATE_CHATORATOR['NotEqualsIgnoreCase']
  },
  {
    label: '小于',
    charator: OPERATE_CHATORATOR['<']
  },
  {
    label: '小于等于',
    charator: OPERATE_CHATORATOR['<=']
  },
  {
    label: '大于',
    charator: OPERATE_CHATORATOR['>']
  },
  {
    label: '大于等于',
    charator: OPERATE_CHATORATOR['>=']
  },
  {
    label: '在集合中',
    charator: OPERATE_CHATORATOR['in']
  },
  {
    label: '不在集合中',
    charator: OPERATE_CHATORATOR['NotIn']
  },
  {
    label: '开始于',
    charator: OPERATE_CHATORATOR['StartWith']
  },
  {
    label: '不开始于',
    charator: OPERATE_CHATORATOR['NotStartWith']
  },
  {
    label: '结束于',
    charator: OPERATE_CHATORATOR['EndWith']
  },
  {
    label: '不结束于',
    charator: OPERATE_CHATORATOR['NotEndWith']
  },
  {
    label: '为空',
    charator: OPERATE_CHATORATOR['Null']
  },
  {
    label: '不为空',
    charator: OPERATE_CHATORATOR['NotNull']
  },
  {
    label: '匹配',
    charator: OPERATE_CHATORATOR['Match']
  },
  {
    label: '不匹配',
    charator: OPERATE_CHATORATOR['NotMatch']
  },
  {
    label: '包含',
    charator: OPERATE_CHATORATOR['Contain']
  },
  {
    label: '不包含',
    charator: OPERATE_CHATORATOR['NotContain']
  }
];
