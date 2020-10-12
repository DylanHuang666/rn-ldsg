/**
 * 字符串工具类
 */
'use strict';

const StringUtil = {


    /**
     * 是否手机号码字符串
     * @param {string} s 
     */
    isMobile(s) {
        return /^[1][23456789][0-9]{9}$/.test(s);
    },

    /**
     * 是否身份证号
     * @param {string} s 
     */
    isIDCardNO(s) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(s);
    },

    /**
     * @description 格式化金额
     * @param number：要格式化的数字
     * @param decimals：保留几位小数 默认2位
     * @param decPoint：小数点符号 默认.
     * @param thousandsSep：千分位符号 默认为,
     */
    formatMoney(number, decimals = 2, decPoint = '.', thousandsSep = ',') {
        number = (number + '').replace(/[^0-9+-Ee.]/g, '')
        let n = !isFinite(+number) ? 0 : +number
        let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
        let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
        let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
        let s = ''
        let toFixedFix = function (n, prec) {
            let k = Math.pow(10, prec)
            return '' + Math.ceil(n * k) / k
        }
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
        let re = /(-?\d+)(\d{3})/
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, '$1' + sep + '$2')
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || ''
            s[1] += new Array(prec - s[1].length + 1).join('0')
        }
        return s.join(dec)
    }
};

export default StringUtil;

/**
* 路径连接
* @param ...args   传入多个路径
* @returns
*/
export const joinPath = function () {
    if (!arguments) return '';
    const l = arguments.length;
    if (l <= 0) return '';
    let ret = arguments[0];
    for (let i = 1; i < l; ++i) {
        const v = arguments[i] + "";
        if (!v) continue;
        if (ret.charAt(ret.length - 1) !== '/' && v.charAt(0) !== '/') {
            ret += '/';
        }
        ret += v;
    }

    return ret;
};


/**
 * 获取path的basename
 * @param {string} path 文件路径
 */
export function getPathBaseName(path) {
    if (!path) return path;

    //只支持 linux系，不处理windows的
    const i = path.lastIndexOf('/');

    //找不到
    if (i < 0) return path;

    return path.substr(i + 1);
}

/**
 * 获得url的basename
 * @param {string} url 
 */
export function getUrlBaseName(url) {
    if (!url) return url;

    let i = url.lastIndexOf('/');
    if (i < 0) {
        i = url.lastIndexOf('\\');
    }

    //找不到
    if (i < 0) return url;

    return url.substr(i + 1);
}

/**
 * 文件路径
 * @param {*} path 
 */
export const getPathMineType = function (path) {
    if (path.lastIndexOf(".") == -1) return ""
    if (path.lastIndexOf(".") < path.lastIndexOf("/")) return ""
    return path.slice(path.lastIndexOf("."))
}