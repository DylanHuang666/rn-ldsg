/**
 * 视图模块间通讯事件枚举
 * 使用规范:
 * 必须是 EVT_UI_{事件名称}
 * 注意要全部大写
 */

/**
 * 个性商城 -> 头像框 -> 选中某个头像框
 * data : {
 *  hdata,
 *  goodsInfo
 * }
 */
export const EVT_UI_MALL_HEAD_FRAME_CHANGE = 'EVT_UI_MALL_HEAD_FRAME_CHANGE';

/**
 * 个性商城 -> 进场特效 -> 预览特效
 * data : {
 *  hdata,
 *  goodsInfo
 * }
 */
export const EVT_UI_MALL_ENTER_EFFECT = 'EVT_UI_MALL_ENTER_EFFECT';