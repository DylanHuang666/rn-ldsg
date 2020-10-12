'use strict'

import Config from "../../configs/Config";
import DesignConvert from "../../utils/DesignConvert";

export const room_hot = () => require('../../../images/main/room_hot.png');

export const room_closed = () => require('../../../images/main/room_closed.png');

export const play = () => require('../../../images/main/play.png');//({uri: Config.getRNImageUrl('main/play.png', 0)});

export const ic_rank = () => require('../../../images/main/home/icon_rank.png')

export const bg = () => ({ uri: Config.getRNImageUrl('main/bg.png', 0) });

export const home = () => require('../../../images/main/home.png');

export const home_sel = () => require('../../../images/main/home_sel.png');

export const rank = () => require('../../../images/main/rank.png');

export const rank_sel = () => require('../../../images/main/rank_sel.png');

export const message = () => require('../../../images/main/message.png');

export const message_sel = () => require('../../../images/main/message_sel.png');

export const mine = () => require('../../../images/main/mine.png');

export const mine_sel = () => require('../../../images/main/mine_sel.png');

export const ic_search = () => require('../../../images/main/home/ic_search.png');

export const ic_enterRoom = () => require('../../../images/main/home/ic_enterRoom.png');

export const ic_gold = () => require('../../../images/ic_gold.png')

export const ic_phone = () => require('../../../images/ic_phone.png')

export const ic_start_play = () => require('../../../images/ic_start_play.png')

export const ic_room_list = () => require('../../../images/ic_room_list.png')

export const ic_recommend_room = () => require('../../../images/ic_recommend_room.png')

export const ic_no_body = () => require('../../../images/ic_no_body.png')

export const white_bg = () => require('../../../images/white_bg.png')

/**
 * HomePage
 */
export const banner_demo = () => require('../../../images/main/home/banner-demo.png');

export const icon_search = () => require('../../../images/main/home/icon-search.png');

export const icon_headlines = () => require('../../../images/main/home/icon-headlines.png');

export const lock = () => require('../../../images/main/home/lock.png');

export const card_bottom_bg = () => require('../../../images/main/home/card_bottom_bg.png');

export const no_live = () => require('../../../images/main/home/no_live.png');

export const no_live2 = () => require('../../../images/main/home/no_live2.png');

export const live_status_white = () => require('../../../images/main/home/live_status_white.gif');

/**
 * MinePage
 */
export const icon_next = () => require('../../../images/mine/icon_next.png');

export const mine_top_bg = () => require('../../../images/mine/top_bg.png');

export const mine_icon_copy = () => require('../../../images/mine/icon_copy.png');

export const mine_rich_lv = (richLv) => ({ uri: Config.getRNImageUrl("rich_lv/" + (richLv > 64 ? 64 : richLv) + "@2x.png", 6) });

export const mine_charm_lv = (charmLv) => ({ uri: Config.getRNImageUrl("charm_lv/" + (charmLv > 64 ? 64 : charmLv) + "@2x.png", 6) });

export const mine_board_bg = () => require('../../../images/mine/board_bg.png');

export const mine_icon_income = () => require('../../../images/mine/icon_income.png');

export const mine_icon_level = () => require('../../../images/mine/icon_level.png');

export const mine_icon_help = () => require('../../../images/mine/icon_help.png');

export const mine_icon_setting = () => require('../../../images/mine/icon_setting.png');

export const upload_photo = () => require('../../../images/mine/upload_photo.png');
//我的等级
export const ic_doubt = () => require('../../../images/leveldescription/ic_doubt.png');


/**
 * Rank
 */
export const rank_middle_bg = () => require('../../../images/rankpage/middle_bg.png');

export const rank_no_1 = () => require('../../../images/rankpage/no_1.png');

export const rank_no_2 = () => require('../../../images/rankpage/no_2.png');

export const rank_no_3 = () => require('../../../images/rankpage/no_3.png');
//头条
export const rank_in_the_room = () => require('../../../images/rankpage/in_the_room.png');

export const aboutus_logo = () => require('../../../images/logo.png');

/**
 * Announcer
 */
export const announcer_item_bg = () => require('../../../images/announcer/announcer_item_bg.png');

export const ic_voice = () => require('../../../images/announcer/ic_voice.png');

export const ic_call = () => require('../../../images/announcer/ic_call.png');


/**
 * Message
 */
export const ic_more = () => require('../../../images/message/ic_more.png');

export const no_friend = () => require('../../../images/message/no_friend.png');

export const no_friend2 = () => require('../../../images/message/no_friend2.png');

export const no_message = () => require('../../../images/message/no_message.png');

export const no_official_message = () => require('../../../images/message/no_official_message.png');

export const ic_customer_service = () => require('../../../images/message/ic_customer_service.png');

export const ic_offical_message = () => require('../../../images/message/ic_offical_message.png');

export const msg_arrow_right = () => require('../../../images/message/msg_arrow_right.png');

export const rank_bg_icon = () => require('../../../images/main/rank_bg_icon.png');

export const rank_bg_icon2 = () => require('../../../images/main/rank_bg_icon2.png');

export const rank_top_bg = () => require('../../../images/main/rank_top_bg.png');

export const gongxian_hot = () => require('../../../images/main/gongxian_hot.png');

export const meili_hot = () => require('../../../images/main/meili_hot.png');

export const rank_three = () => require('../../../images/main/rank_three.png');

export const rank_two = () => require('../../../images/main/rank_two.png');

export const rank_one = () => require('../../../images/main/rank_one.png');

export const gx_hot = () => require('../../../images/main/gx_hot.png');

export const icon_chathall = () => require('../../../images/icon_chathall.png')

export const bg_chat_hall = () => require('../../../images/main/bg_chat_hall.png')

export const ic_sanjiao = () => require('../../../images/main/ic_sanjiao.png')

export const icon_official_msg = () => require('../../../images/icon_official_msg.png')

export const icon_sys_msg = () => require('../../../images/icon_sys_msg.png')

export const icon_fans = () => require('../../../images/icon_fans.png')

export const icon_follow = () => require('../../../images/icon_follow.png')

export const icon_phone_record = () => require('../../../images/icon_phone_record.png')

export const icon_online_menber = () => require('../../../images/icon_online_menber.png')

export const bg_name = () => require('../../../images/main/bg_name.png')

export const ic_location = () => require('../../../images/ic_location.png')

export const theme_bg = () => require('../../../images/theme_bg.png')

export const chat_enter_room = () => require('../../../images/chat_enter_room.png')
