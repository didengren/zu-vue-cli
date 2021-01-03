export const RegRules = {
  space: /^\s+$/,
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  mobile: /^1\d{10}$/,
  idNo: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
  positiveNum: /^\d+(\.\d{1,2})*$/,
  intNum: /^\d+$/,
  unitsNum: /^\d$/
};

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ["admin", "editor"];
  return valid_map.indexOf(str.trim()) >= 0;
}
