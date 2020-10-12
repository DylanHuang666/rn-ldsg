//-------------------------------------
// 字符串扩展
//-------------------------------------

String.prototype.format = function(args){
    let result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object" && !(args instanceof Array)) {//不行
            for (let key in args) {
                if(args[key]!=undefined){
                    let reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (let i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //let reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
　　　　　　　　　　　　let reg= new RegExp("({)" + (i) + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

String.prototype.replaceAll = function(oldVal, newVal){  
    return this.replace(new RegExp(oldVal, "g"), newVal); 
};

const DATE_REG_EXP = new RegExp('-', "g");
String.prototype.toDateTimeTick = function() {
    return new Date(this.replace(DATE_REG_EXP, '/')).getTime();
}