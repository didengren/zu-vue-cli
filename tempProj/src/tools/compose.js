/**
 * 组合式函数
 * @param {Array} fn Function[]
 */

function compose(...fn) {
  var length = fn.length;
  var index = length;
  while (index--) {
    if (typeof fn[index] !== "function") {
      throw new TypeError("Expected a function");
    }
  }
  return function(...args) {
    var index = 0;
    var result = length ? fn[index].apply(this, args) : args[0];
    while (++index < length) {
      result = fn[index].call(this, result);
    }
    return result;
  };
}

export default compose;
