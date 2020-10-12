//-------------------------------------
// 全局函数扩展
//-------------------------------------

//全局异常捕捉
if (!__DEV__) {

    require('ErrorUtils').setGlobalHandler(err => {
        /**
         * err {
         *    message
         *    stack
         * }
         * 需要上传错误日志到服务器，这里仅简单打印错误信息
         */
        
        // 测试服弹黄框提示
        const message = err && err.message ? err.message : '';
        const stack = err && err.stack ? err.stack : '堆栈信息呢？';

        // if (Conf.isTestServer()) {
        //     require('../router/level4_router').showErrorView(message, stack);
        // }

        const exception = message + '\n' + stack;
        // 异常信息上传到bugly
        const ReactNative = require('react-native');
        ReactNative.NativeModules.Bugly && ReactNative.NativeModules.Bugly.reportErrorLog(exception);
    });

}

// //对象深度复制
// global.cloneObject = obj => {
//     let o;
//     switch(typeof obj){
//     case 'undefined': break;
//     case 'string'   : o = obj + '';break;
//     case 'number'   : o = obj - 0;break;
//     case 'boolean'  : o = obj;break;
//     case 'object'   :
//         if(obj === null){
//             o = null;
//         }else{
//             if(obj instanceof Array){
//                 o = [];
//                 for(let i = 0, len = obj.length; i < len; i++){
//                     o.push(cloneObject(obj[i]));
//                 }
//             }else{
//                 o = {};
//                 for(let k in obj){
//                     o[k] = cloneObject(obj[k]);
//                 }
//             }
//         }
//         break;
//     default:        
//         o = obj;break;
//     }
//     return o;    
// };

// //生成UUID
// global.genUUID = () => {
//     let s = [];
//     let hexDigits = '0123456789abcdef';
//     for (let i = 0; i < 36; i++) {
//         s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//     }
//     s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
//     s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
//     s[8] = s[13] = s[18] = s[23] = '-';
 
//     return s.join('');
// };

// //捕获Exception后，需要统一调用
// global.traceException = err => {
//     console.error(err);
//     console.log(err.stack);
// }


// /* 
//  * 打印 JavaScript 函数调用堆栈 
//  */  
// global.printCallStack = () => {
// 	try {
// 		throw new Error('printCallStack');
// 	} catch(e) {
// 		console.log(e.stack);
// 	}
// }


//console.disableYellowBox = true

