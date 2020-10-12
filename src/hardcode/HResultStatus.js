'use strict';

const HResultStatus = {

    ERROR_SERVER_DATA_ERROR: -100000,       //跟服务器约定的数据格式错误
    ERROR_NOT_CONNECT: -100001,             //断开了连接，或者连接不上
    ERROR_TIME_OUT: -100002,                //请求超时
    ERROR_DISCONNECT: -100003,              //断开连接
    ERROR_PARSE: -100004,                   //解析数据包错误
    ERROR_SAVE: -100005,                    //保存login/logon参数错误
    ERROR_GET_STATIC_DATA: -100006,         //获取静态数据错误
    ERROR_TRY_LOGON_FAIL: -100007,          //尝试重新logon失败
    ERROR_TRY_LOGIN_FAIL: -100008,          //尝试重新login失败
    ERROR_TRY_LOGIN_SAVE_FAIL: -100009,     //尝试重新登录后保存logon参数失败
    ERROR_RELOGIN: -100010,                 //登录中，或者已经登录了，再次调用登录

    ServerNotStart: 0,//服务器没启动完成！
    Success: 1,//成功
    Fail: 2,//请求失败！
    Session_TimeLimit: 3,//session过期
    Login_Param_Wrong: 8,//这个貌似被顶号后会触发，处理方式和Session_TimeLimit一样就好


    /**
     * 声优认证
     */
    UserSkillApplyingRecordExit: 310,           //已提交过技能申请资料,请勿重复提交
    UserSkillApplyRecordNotExitOrRefused: 311,  //此用户没有提交过陪聊技能审核申请或者第一次申请已被拒绝

    ChattingServiceUserSkillInfoNotExit: 312,  //此用户还没有成为1V1陪聊主播

    AnchorNoSkill: 304,  //该主播无陪聊资格
    AnchorOnCalling: 305,  //主播正在陪聊中
    AnchorNoDisturb: 306,  //主播开启了勿扰
};

export default HResultStatus;