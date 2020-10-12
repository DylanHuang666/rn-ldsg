/**
 * 所有硬编码常量
 * 
 */

'use strict';

export const ESex_Type_MALE = 1;// 男
export const ESex_Type_FEMALE = 2;// 女
export const ESex_Type_UNKNOW = 3;// 未知(注册默认)


export const COIN_NAME = '金币';//货币名称
export const ANNOUNCER_UNIT = '钻/分钟';//1v1热聊计量单位


export const MAX_LABEL = 3;//标签评价最大可选择数
export const MAX_ABLUM = 9;//相册最大可选择数

export const MAX_VIDEO_SIZE = 30 * 1000 * 1000;//视频最大size
export const MAX_VIDEO_DURATION = 30000;//视频最大毫秒数


export const OFFICIAL_NAME = '官方消息';//官方消息名字
export const OFFICIAL_DESC = '要常来看看我哦';//官方消息默认显示
export const SECRETARY_NAME = '系统通知';//小秘书名字
export const SECRETARY_DESC = '嘻嘻嘻，终于等到你啦~';//小秘书会话默认显示

export const CLICK_INTERVAL = 500;//点击防抖间隔时间

export const HEAD_DECORATOR_SCALE = 520 / 344;   //头像框 与 头像的比例

const HGlobal = {
    EGG_ACTION: '在好运机',
    EGG_ACTION_NAME: '砸蛋',
    EGG_A: '摇好运模式',
    EGG_B: '摇暴走模式',
    EGG_C: '摇疯狂模式',
}

export default HGlobal;
