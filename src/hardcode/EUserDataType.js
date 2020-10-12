
/**
 * EUserDataType
 * 用户请求用户信息
 */

export const EUserDataType = {
    NICKNAME: 1,// 用户昵称
    LOGOTIME: 1 << 1,// 修改ogo的时间 0为没修改过
    ThirdIconurl: 1 << 2,// 第三方头像
    HeadFrameId: 1 << 3,// 当前使用的头象框ID(没有就为空字符串)
    SEX_ANG_AGE: 1 << 4,// 性别和年龄
    EVE: 1 << 5,// 等级
    PHONENUM: 1 << 6,// 电话号码
    SLOGAN: 1 << 7,// 个性签名
    POSITION: 1 << 8,// 地理位置
    CONSTEATION: 1 << 9,// 星座
    BIRTHDAY: 1 << 10,// 生日
    BANNERS: 1 << 11,// 用户相册

    VIPEVE: 1 << 12,// VIP等级
    CHARMEVE: 1 << 13,// 魅力等级
    CHARM: 1 << 14,// 魅力
    CONTRIBUTELEVEL: 1 << 15,// 贡献等级
    CONTRIBUTE: 1 << 16,// 贡献

    GODSHE: 1 << 17,// 金贝
    BINDGODSHE: 1 << 18,// 绑定金贝

    MYOVES: 1 << 19,// 我关注的数
    FRIENDS: 1 << 20,// 被关注数(粉丝数)
    FRIENDSTATUS: 1 << 21,// 好友状态
    // 0是自己,1是好友,2已关注,3已被关注
    FRIENDREMARK: 1 << 22, // 好友备注

    HASCAR: 1 << 23,// 是否拥有座驾
    HASGIFT: 1 << 24,// 是否收到礼物

    MOMENTNUM: 1 << 25,// 动态数量
    MODIFYTIPS: 1 << 26,// 编辑提示

    ROOMDATA: 1 << 27,// 所在的房间信息
    FOOWENTERROOM: 1 << 28,// 跟随进房
    OPENTIPS: 1 << 29,// 开播提醒
    SHAKEMICUP: 1 << 30,// 摇一摇上mic

    ONINE: 1 << 31, // 是否在线
    OGOUTTIME: 4294967296,//1 << 32,// 最后登出时间=0代表在线(需要加2017-01-01)
    OFFICIA: 8589934592,//1 << 33,// 是否黑马管理员

    INVISIBE: 17179869184,      //1 << 34,// 是否隐身
    MEDA: 34359738368,          //1 << 35,//佩戴的勋章
    BAANCE: 68719476736,        //1 << 36,// 可提现现金
    DayiveEarn: 137438953472,   //1 << 37,// 当天收益

    RabbitCoin: 274877906944,   //1 << 38,// 兔子币
    CarId: 549755813888,        //1 << 39,// 当前使用的坐驾ID(没有就为空字符串)
    DiaogFrameId: 1099511627776,//1 << 40,// 当前使用的对话框ID(没有就为空字符串)

    ISCERTIFICATION: 2199023255552, //1 << 41,//是否实名认证：true已实名认证，fase未实名认证
    ISNEWUSER: 4398046511104,       //1 << 42,//是否新用户
    FAMIYID: 8796093022208,         //1 << 43,//当前家族id

    GUARDIANS: 70368744177664,          //1 << 46,// 守护我的人
    IS_OPEN_OVE_RING: 140737488355328,  //1 << 47,// 是否开启恋爱铃

    IS_ACPT_MIC_INVT: 281474976710656,          //1 << 48,// 是否开启接受房间外连麦邀请
    MATCHMAKERSTATUS: 562949953421312,          //1 << 49,// 月老/红娘 状态
    NOT_FRIEND_NEED_AGREE: 1125899906842624,    //1 << 50,// 非好友邀请进群是否需求同意设置
    IS_SET_PAY_PASSWORD: 4503599627370496,      //1 << 52,// 是否设置支付密码
}

