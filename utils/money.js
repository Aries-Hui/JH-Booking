/**
 * 将数字转换成金额显示
 * @method formatMoney
 * @param num 将转化的数字
 * @return money 格式化金额
 */ 
const formatMoney =  num  => {
  if (num == 0) return money = "¥0.00元"; 
  if (num) {
    if (isNaN(num)) {
      console.info('金额中含有不能识别的字符');
      return 'NAN';
    }
    
    num = typeof num == 'string' ? parseFloat(num) : num // 判断是否是字符串如果是字符串转成数字

    bool = false
    if(num<0){
      bool = true
      num = Math.abs(num)
    }

    num = num.toFixed(2); // 保留两位
    
    var intSum = formatNumber(num.substring(0,num.indexOf(".")));//取到整数部分

    if(!bool)
      return "¥"+ intSum + "." + num.substring(num.indexOf('.')+1, num.length) + "元"; 
    else
      return "¥ -"+ intSum + "." + num.substring(num.indexOf('.')+1, num.length) + "元"; 
  } else {
    return null;
  }
}

function formatNumber(str) {
  return str.split("").reverse().reduce(function(prev, next, index) {
    return ((index % 3) ? next : (next + ',')) + prev
  })
}

module.exports = {
  formatMoney: formatMoney
}
