/* eslint-disable */
String.prototype.trims = function() {
  // this.replace(/^\s+/, '').replace(/\s+$/, '')
  return this.replace(/\s/g, "");
};

/**
 * 存储localStorage
 */
export const setStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};
/**
 * 获取localStorage
 */
export const getStorage = (name) => {
  if (!name) return;

  const val = window.localStorage.getItem(name);

  return val ? JSON.parse(val) : val
};
/**
 * 删除localStorage
 */
export const removeStorage = (name) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};
/**
 * 存储sessionStorage
 */
export const setSessionStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
};
/**
 * 获取sessionStorage
 */
export const getSessionStorage = (name) => {
  if (!name) return;
  return window.sessionStorage.getItem(name);
};
/**
 * 删除sessionStorage
 */
export const removeSessionStorage = (name) => {
  if (!name) return;
  window.sessionStorage.removeItem(name);
};

/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
export function debounce(func, wait = 50, immediate = true) {
  let timer, context, args;

  // 延迟执行函数
  const later = () =>
    setTimeout(() => {
      // 延迟函数执行完毕，清空缓存的定时器序号
      timer = null;
      // 延迟执行的情况下，函数会在延迟函数中执行
      // 使用到之前缓存的参数和上下文
      if (!immediate) {
        func.apply(context, args);
        context = args = null;
      }
    }, wait);

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later();
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params);
      } else {
        context = this;
        args = params;
      }
      // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
      // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer);
      timer = later();
    }
  };
}

/**
 * 加强版节流函数 throttle
 *
 * @param {function} fn   回调函数
 * @param {number}   wait 表示时间窗口的间隔
 */
// fn 是需要节流处理的函数
// wait 是时间间隔
export function throttle(fn, wait) {
  // previous 是上一次执行 fn 的时间
  // timer 是定时器
  let previous = 0;
  let timer = null;

  // 将 throttle 处理结果当作函数返回
  return function(...args) {
    // 获取当前时间，转换成时间戳，单位毫秒
    let now = +new Date();

    // ------ 新增部分 start ------
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔
    if (now - previous < wait) {
      // 如果小于，则为本次触发操作设立一个新的定时器
      // 定时器时间结束后执行函数 fn
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        previous = now;
        fn.apply(this, args);
      }, wait);
      // ------ 新增部分 end ------
    } else {
      // 第一次执行
      // 或者时间间隔超出了设定的时间间隔，执行函数 fn
      previous = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 获取url参数
 *
 * @param {string} variable
 */
export function getQueryVariable(variable) {
  var query;
  if (window.location.hash) {
    query = window.location.hash.substring(1);
    if (query.split("?")[1]) query = query.split("?")[1].substring(0);
    else return false;
  } else if (window.location.search) {
    query = window.location.search.substring(1);
  } else return false;
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
}

/**
 * 手机格式验证
 * @param val
 */
export const telVerify = (val) => {
  let res;
  let reg = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
  if (!val) {
    res = {
      code: false,
      msg: "手机号码不能为空"
    };
  } else {
    if (reg.test(val)) {
      res = {
        code: true,
        msg: ""
      };
    } else {
      res = {
        code: false,
        msg: "手机号码格式错误"
      };
    }
  }
  return res;
};
/**
 * 密码格式验证
 * @param val
 */
export const pwdVerify = (val) => {
  let res;
  let reg = /^[0-9A-Za-z]{6,12}$/;
  if (!val) {
    res = {
      code: false,
      msg: "密码不能为空"
    };
  } else {
    if (reg.test(val)) {
      res = {
        code: true,
        msg: ""
      };
    } else {
      res = {
        code: false,
        msg: "密码格式错误"
      };
    }
  }
  return res;
};
/**
 * 格式化时间戳
 */
export const formatDate = function(time, fmt = "yyyy/MM/dd") {
  if (!time) return;

  const date = new Date(time);
  if (/(y+)/i.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
      );
    }
  }
  return fmt;
};
/**
 * 格式化时间戳日期时分秒
 */
export const formatDateFull = function(date, seperator1) {
  var dateObj = new Date(date);
  var year = dateObj.getFullYear();
  var month = dateObj.getMonth() + 1;
  var strDate = dateObj.getDate();
  var hours = dateObj.getHours();
  var minutes = dateObj.getMinutes();
  var seconds = dateObj.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  var currentdate =
    year +
    seperator1 +
    month +
    seperator1 +
    strDate +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return currentdate;
};
export function getNowFormatDate(seperator1) {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
/**
 * 隐藏身份证中间位数
 */
export function formatID(idNo) {
  if (idNo) {
    return idNo.replace(/(\d{4})\d*(\w{4})/, "$1******$2");
  }
}
/**
 * 货币格式
 */
export const formatMoney = function(number, places, symbol, thousand, decimal) {
  number = number || 0;
  places = !isNaN((places = Math.abs(places))) ? places : 2;
  symbol = symbol !== undefined ? symbol : "$";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var negative = number < 0 ? "-" : "";
  var i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + "";
  var j = i.length > 3 ? i.length % 3 : 0;
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + thousand : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : "")
  );
};

/**
 * 加法函数，用来得到精确的加法结果
 * 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 * 调用：accAdd(arg1,arg2)
 * 返回值：arg1加上arg2的精确结果
 */
export function accAdd(arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}
/**
 * 减法函数，用来得到精确的减法结果
 * 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 * 调用：accSub(arg1,arg2)
 * 返回值：arg1减去arg2的精确结果
 */
export function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
/**
 * 乘法函数，用来得到精确的乘法结果
 * 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 * 调用：accMul(arg1,arg2)
 * 返回值：arg1乘以 arg2的精确结果
 */
export function accMul(arg1, arg2) {
  var m = 0;
  var s1 = arg1.toString();
  var s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
}
/**
 * 除法函数，用来得到精确的除法结果
 * 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 * 调用：accDiv(arg1,arg2)
 * 返回值：arg1除以arg2的精确结果
 */
export function accDiv(arg1, arg2) {
  var t1 = 0;
  var t2 = 0;
  var r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {}
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}
/**
 * 强制保留小数点后两位小数
 * 调用：toDecimal2(val)
 * 返回值：保留小数后的val
 */
export function toDecimal2(val) {
  let f = parseFloat(val);
  if (isNaN(f)) {
    return false;
  }
  let f1 = Math.round(val * 100) / 100;
  var s = f1.toString();
  var rs = s.indexOf(".");
  if (rs < 0) {
    rs = s.length;
    s += ".";
  }
  while (s.length <= rs + 2) {
    s += "0";
  }
  return s;
}
/**
 * 传入rem为单位的数值，返回px为单位的数值
 * @param val
 * @return px为单位的数值
 */
export function backPX(val) {
  return (
    parseFloat(window.document.documentElement.style.fontSize) * Number(val)
  );
}
/**
 * 深拷贝
 * @param {obj} 拷贝对象
 */
export const clone = (obj) => {
  var o;
  // 如果  他是对象object的话  , 因为null,object,array  也是'object';
  if (typeof obj === "object") {
    // 如果  他是空的话
    if (obj === null) {
      o = null;
    } else {
      // 如果  他是数组arr的话
      if (obj instanceof Array) {
        o = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(clone(obj[i]));
        }
      }
      // 如果  他是对象object的话
      else {
        o = {};
        for (var j in obj) {
          o[j] = clone(obj[j]);
        }
      }
    }
  } else {
    o = obj;
  }
  return o;
};

/**
 * list 转 map
 * @param {list}
 */
export const transListToMap = (list = []) => {
  let _map = {};

  list.forEach((item) => {
    _map[item.value] = item.name;
  });
  return _map;
};

/**
 * map 转 list
 */
export const transMapToList = (map) => {
  let list = [];
  for (let key in map) {
    list.push(map[key]);
  }
  return list;
};

const userAgent = navigator.userAgent;
export const isAndroid = () => {
  return userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1; //android终端
};

export const isIOS = () => {
  return !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
};

export function getDirsTogether(modulesPath, initialValue) {
  let res;
  let keys = modulesPath.keys();
  if (~toString.call(initialValue).indexOf("Array")) {
    res = keys.reduce((sum, item) => {
      const sub = modulesPath(item).default || [];
      sum.push(...sub);
      return sum;
    }, initialValue);
  } else if (~toString.call(initialValue).indexOf("Object")) {
    res = keys.reduce((sum, item) => {
      const moduleName = item.replace(/^\.\/(.*)\.\w+$/, "$1");
      const value = modulesPath(item);
      sum[moduleName] = value.default;
      return sum;
    }, initialValue);
  }
  return res;
}

// 通用判断指定数据类型
export function isType(v, T) {
  return ~{}.toString.call(v).indexOf(`${T}`);
}

export function isNum(payload) {
  return !isNaN(+JSON.stringify(payload))
}
