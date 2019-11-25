export function getNode(data, id) {
  let result;

  function core(data, id) {
    data.forEach(item => {
      if (item.id === id) {
        result = item;
      } else if (Array.isArray(item.subConditions) && item.subConditions.length > 0) {
        core(item.subConditions, id);
      }
    });
  }

  core(data, id);

  return result;
}

// 不返回一个新的数组
function map(data, fn) {
  let result = [];

  data.forEach(item => {
    result.push(fn(item));
  });

  return result;
}

// 根据值的id查询到引用
export function getValueType(data, id) {
  let result;

  function core(data, id) {
    data.forEach(item => {
      if (item.id === id) {
        result = item;
      } else if (item.value && Array.isArray(item.value.parameters) && item.value.parameters.length > 0) {
        core(map(item.value.parameters, i => i.value), id);
        // core(item.value.parameters.map(i => i.value), id)
      }
    });
  }

  core(data, id);

  return result;
}
