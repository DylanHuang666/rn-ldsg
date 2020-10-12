'use strict'

import Config from "../../configs/Config";

export const question = () => ({ uri: Config.getRNImageUrl('question.png', 0) });

export const wx = () => ({ uri: Config.getRNImageUrl('tencent/wx.png', 1) });

export const icon_qq = () => ({ uri: Config.getRNImageUrl('icon_qq.png', 0) });

export const user = () => ({ uri: Config.getRNImageUrl('login/user.png', 0) });

export const bg = () => require('../../../images/main/login/login_bg.png');

export const login_top = () => require('../../../images/main/login/login_top.png');

export const loging_chang = () => require('../../../images/main/login/loging_chang.png');

export const login_phone = () => require('../../../images/main/login/login_phone.png');

export const login_userid = () => require('../../../images/main/login/login_userid.png');

export const login_pwsafe = () => require('../../../images/main/login/login_pwsafe.png');

export const login_icon = () => ({ uri: Config.getRNImageUrl('login/ic_login_logo.png', 3) });

export const zuanzuan_logo = () => ({ uri: Config.getRNImageUrl('login/zuanzuan_logo.png', 0) });

export const open_eye = () => ({ uri: Config.getRNImageUrl('login/open_eye.png', 0) });

export const close_eye = () => ({ uri: Config.getRNImageUrl('login/close_eye.png', 0) });

export const account_del = () => ({ uri: Config.getRNImageUrl('login/account_del.png', 0) });

export const l_uncheck = () => ({ uri: Config.getRNImageUrl('login/l_uncheck.png', 0) });

export const l_check = () => ({ uri: Config.getRNImageUrl('login/l_check.png', 0) });