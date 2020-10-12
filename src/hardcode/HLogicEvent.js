/**
 * 逻辑业务模块间通讯事件枚举
 * 使用规范:
 * 必须是 EVT_LOGIC_{事件名称}
 * 注意要全部大写
 */

/**
 * 外部更新榜单选中页面索引
 */
export const EVT_LOGIC_UPDATE_RANK_PAGE_INDEX = 'EVT_LOGIC_UPDATE_RANK_PAGE_INDEX';

/**
 * 语音房间好友banner数据更新
 */
export const EVT_LOGIC_VOICE_FRIEND_BANNER = 'EVT_LOGIC_VOICE_FRIEND_BANNER';

/**
 * 更新用户信息事件
 */
export const EVT_LOGIC_UPDATE_USER_INFO = 'EVT_LOGIC_UPDATE_USER_INFO';

/**
 *  更新连击组件事件
 */
export const EVT_LOGIC_UPDATE_COMBO_SHOW = 'EVT_LOGIC_UPDATE_COMBO_SHOW'

/**
 *  重置连击计时事件
 */
export const EVT_LOGIC_UPDATE_COMBO_TIME = 'EVT_LOGIC_UPDATE_COMBO_TIME'

/**
 *  更新砸蛋跑道
 */
export const EVT_LOGIC_UPDATE_ZADAN_BANNER = 'EVT_LOGIC_UPDATE_ZADAN_BANNER'

/**
 *  更新礼物跑道
 */
export const EVT_LOGIC_UPDATE_GIFT_BANNER = 'EVT_LOGIC_UPDATE_GIFT_BANNER'

/**
 *  本房间礼物
 */
export const EVT_LOGIC_GIFT_MY_ROOM = 'EVT_LOGIC_GIFT_MY_ROOM'

/**
 *  更新全服砸蛋跑道
 */
export const EVT_LOGIC_UPDATE_FULL_SERVICE_ZADAN_BANNER = 'EVT_LOGIC_UPDATE_FULL_SERVICE_ZADAN_BANNER'

/**
 *  更新全服礼物跑道
 */
export const EVT_LOGIC_UPDATE_FULL_SERVICE_GIFT_BANNER = 'EVT_LOGIC_UPDATE_FULL_SERVICE_GIFT_BANNER'

/**
 *  更新全服锦鲤活动跑道
 */
export const EVT_LOGIC_UPDATE_FULL_SERVICE_KOIFISH_BANNER = 'EVT_LOGIC_UPDATE_FULL_SERVICE_KOIFISH_BANNER'

/**
 *  更新房间键盘事件
 */
export const EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE = 'EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE'

/**
 *  更新礼物面板金币数量
 */
export const EVT_LOGIC_UPDATE_GIFT_PANEL_CONIN_NUM = 'EVT_LOGIC_UPDATE_GIFT_PANEL_CONIN_NUM'

/**
 *  礼物飞行事件通知 (自己送礼)
 */
export const EVT_LOGIC_UPDATE_GIFT_FLY = 'EVT_LOGIC_UPDATE_GIFT_FLY'

/**
 *  礼物飞行事件通知 (别人送礼)
 */
export const EVT_LOGIC_UPDATE_OTHER_PERSON_GIFT_FLY = 'EVT_LOGIC_UPDATE_OTHER_PERSON_GIFT_FLY'

/**
 * 全屏礼物
 */
export const EVT_LOGIC_SHOW_FULL_SCREEN_WEBP = 'EVT_LOGIC_SHOW_FULL_SCREEN_WEBP';

/**
 *  通知要去送礼
 */
export const EVT_LOGIC_UPDATE_DO_SEND_GIFT = 'EVT_LOGIC_UPDATE_DO_SEND_GIFT'


/**
 * 切换礼物面板
 */
export const EVT_LOGIC_CHANGE_GIFT_TAB = 'EVT_LOGIC_CHANGE_GIFT_TAB'

/**
 * 选中礼物数量
 */
export const EVT_LOGIC_CHOOSE_GIFT_NUM = 'EVT_LOGIC_CHOOSE_GIFT_NUM'

/**
 * 更新钱包余额
 */
export const EVT_UPDATE_WALLET = 'EVT_UPDATE_WALLET'

/**
 * 清除聊天消息事件
 */
export const EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST = 'EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST';

/**
 * 会话已读事件
 */
export const EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD = 'EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD';

/**
 * 在房间自己角色发生变化
 */
export const EVT_LOGIC_ROOM_JOB_CHANGE = 'EVT_LOGIC_ROOM_JOB_CHANGE'


/**
 * 更新房间人数
 */
export const EVT_LOGIC_UPDATE_ROOM_ONLINE = 'EVT_LOGIC_UPDATE_ROOM_ONLINE'


/**
 * 更新房间公告
 */
export const EVT_LOGIC_UPDATE_ROOM_NOTIC = 'EVT_LOGIC_UPDATE_ROOM_NOTIC'

/**
 * 更新房间背景
 */
export const EVT_LOGIC_UPDATE_ROOM_BG = 'EVT_LOGIC_UPDATE_ROOM_BG'


/**
 * 房间动画播放开关有变化
 */
export const EVT_LOGIC_ROOM_ANIM_SWITCH_CHANGE = 'EVT_LOGIC_ROOM_ANIM_SWITCH_CHANGE'

/**
 * 自己的mic发生变化
 */
export const EVT_LOGIC_SELF_MIC_CHANGE = 'EVT_LOGIC_SELF_MIC_CHANGE'


/**
 * 房间功能面板有变化
 */
export const EVT_LOGIC_REFRESH_ROOM_MORE = 'EVT_LOGIC_REFRESH_ROOM_MORE'


/**
 * 自己被踢出直播间
 */
export const EVT_LOGIC_SELF_BY_KICK = 'EVT_LOGIC_SELF_BY_KICK'

/**
 * 刷新房间
 */
export const EVT_LOGIC_ROOM_REFRESH_ROOM = 'EVT_LOGIC_ROOM_REFRESH_ROOM'

/**
 * 首页滑到顶部
 */
export const EVT_LOGIC_ROOM_SCROLL_TOP = 'EVT_LOGIC_ROOM_SCROLL_TOP'

/**
 * 首页滑到指定位置
 */
export const EVT_LOGIC_ROOM_SCROLL_ANY = 'EVT_LOGIC_ROOM_SCROLL_ANY'

/**
 * 首页点击文字展开按钮刷新滑动距离
 */
export const EVT_LOGIC_ROOM_REFRESH_Y = 'EVT_LOGIC_ROOM_REFRESH_Y'

/**
 * 进入房间
 */
export const EVT_LOGIC_ENTER_ROOM = 'EVT_LOGIC_ENTER_ROOM'

/**
 * 离开房间
 */
export const EVT_LOGIC_LEAVE_ROOM = 'EVT_LOGIC_LEAVE_ROOM'

/**
 * 有座驾的玩家进房
 */
export const EVT_LOGIC_CAR_ENTER = 'EVT_LOGIC_CAR_ENTER'


/**
 * 收到公聊大厅消息
 */
export const EVT_LOGIC_CHAT_HALL = 'EVT_LOGIC_CHAT_HALL'


//1v1陪聊
/**
 * 用户取消呼叫
 */
export const EVT_LOGIC_PHONE_CANCEL = 'EVT_LOGIC_PHONE_CANCEL'

/**
 * 进入陪聊
 */
export const EVT_LOGIC_PHONE_START = 'EVT_LOGIC_PHONE_START'

/**
 * 停止陪聊
 */
export const EVT_LOGIC_PHONE_STOP = 'EVT_LOGIC_PHONE_STOP'

/**
 * 陪聊数据更新
 */
export const EVT_LOGIC_PHONE_UPDATE = 'EVT_LOGIC_PHONE_UPDATE'

/**
 * 切换首页tab
 */
export const EVT_LOGIC_HOMEPAGE_TAB_CHANGE = 'EVT_LOGIC_HOMEPAGE_TAB_CHANGE'

/**
 * 点赞动态刷新我赞过的
 */
export const EVT_LOGIC_LIKE_MOMENT_CHANGE = 'EVT_LOGIC_LIKE_MOMENT_CHANGE'

/**
 * 送礼盒礼物
 */
export const EVT_LOGIC_SHOW_FULL_SCREEN_FLASH = 'EVT_LOGIC_SHOW_FULL_SCREEN_FLASH'