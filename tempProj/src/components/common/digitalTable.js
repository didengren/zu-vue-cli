import Vue from "vue";
import { accMul, accDiv } from "@/tools/utils";

const TRIM_REG = /^\s+|\s+/g;
const INDEX_REG = /^(0|[1-9][0-9]*)$/;

function unitEnum(index = 0) {
  return [
    { name: "万", offset: 4 },
    { name: "十万", offset: 5 },
    { name: "百万", offset: 6 },
    { name: "千万", offset: 7 },
    { name: "亿", offset: 8 },
    { name: "十亿", offset: 9 },
    { name: "百亿", offset: 10 },
    { name: "千亿", offset: 11 },
    { name: "兆", offset: 12 }
  ][index];
}

/**
 * 数字单位/千分位
 *
 * @param el
 * @param digit       要转化的值
 * @param maxDigit    整数部分最大多少位
 * @param open        是否使用千分位
 * @param decimals    保留小数点几位
 * @param unitIndex   数字单位的索引
 */
function reformDigital(
  el,
  digit,
  { maxDigit = 100, open = true, decimals = 2, unitIndex = undefined }
) {
  if (isNaN(+String(digit))) return;

  let completeObj;

  let objDeconstructArr = digit.replace(TRIM_REG, "").split("");
  let which = objDeconstructArr.indexOf(".");
  let end = ~which ? which : undefined;
  let intPartObj = objDeconstructArr.slice(0, end);

  if (INDEX_REG.test(unitIndex)) {
    const unitInfo = unitEnum(unitIndex);
    if (intPartObj.length > unitInfo.offset) {
      objDeconstructArr.splice(which, 1);
      objDeconstructArr.splice(intPartObj.length - unitInfo.offset, 0, ".");
      digit = +objDeconstructArr.join("");
      completeObj =
        getCompleteResult(digit, open, true, decimals) + unitInfo.name;
    } else {
      completeObj = getCompleteResult(digit, open, true, decimals);
    }
  } else if (INDEX_REG.test(maxDigit) && intPartObj.length > maxDigit) {
    digit = repeat(maxDigit, 9);
    completeObj = getCompleteResult(digit, open, false) + "+";
  } else {
    completeObj = getCompleteResult(digit, open, true, decimals);
  }

  el.innerHTML = completeObj;
}

function getCompleteResult(raw, isOpen, isKeepDecimals, decimals) {
  let transit;
  if (isKeepDecimals) {
    const pow = Math.pow(10, decimals);
    transit = Math.floor(accMul(+raw, pow));
    transit = accDiv(transit, pow);
  } else transit = +raw;
  return isOpen ? transit.toLocaleString() : transit;
}

function repeat(n, str = 9) {
  return +new Array(n + 1).join(str);
}

// 注册一个全局自定义指令 `v-digital-table`
Vue.directive("digitalTable", {
  // bind: function(el, binding, vnode, oldVnode) {},
  // inserted: function(el, binding, vnode, oldVnode) {},
  // update: function(el, binding, vnode, oldVnode) {},
  componentUpdated: function(el, binding, vnode, oldVnode) {
    if (typeof binding.value === "undefined") binding.value = {};
    if (vnode.children.length > 0 && vnode.children[0].text) {
      // console.log("raw value___", vnode.children[0].text);
      reformDigital(el, vnode.children[0].text, binding.value);
    }
  }
});
