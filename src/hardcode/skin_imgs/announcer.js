'use strict'

import Config from "../../configs/Config";

export const audio_recording = () => Config.getRNImageUrl('announcer/audio_recording.svga', 1);

export const ic_skill = () => ({ uri: Config.getRNImageUrl('announcer/ic_skill.png', 1) });

export const ic_price = () => ({ uri: Config.getRNImageUrl('announcer/ic_price.png', 0) });

export const ic_voice = () => ({ uri: Config.getRNImageUrl('announcer/ic_voice.png', 0) });

export const ic_vioce_normal = () => ({ uri: Config.getRNImageUrl('announcer/ic_vioce_normal.png', 0) });

export const ic_vioce_recording = () => ({ uri: Config.getRNImageUrl('announcer/ic_vioce_recording.png', 0) });

export const ic_vioce_cancel = () => ({ uri: Config.getRNImageUrl('announcer/ic_vioce_cancel.png', 0) });

export const ic_vioce_start = () => ({ uri: Config.getRNImageUrl('announcer/ic_vioce_start.png', 0) });

export const ic_upload_photo = () => ({ uri: Config.getRNImageUrl('announcer/ic_upload_photo.png', 0) });

/**
 * 认证状态
 */
export const cert_succ = () => ({ uri: Config.getRNImageUrl('announcer/cert_succ.png', 0) });

export const cert_ing = () => ({ uri: Config.getRNImageUrl('announcer/cert_ing.png', 0) });

export const cert_fail = () => ({ uri: Config.getRNImageUrl('announcer/cert_fail.png', 0) });


/**
 * Phone
 */
export const phone_start = () => ({ uri: Config.getRNImageUrl('announcer/phone/phone_start.png', 1) });

export const status_svga = () => Config.getRNImageUrl('announcer/phone/status_svga.svga', 0);

export const phone_status = () => ({ uri: Config.getRNImageUrl('announcer/phone/phone_status.png', 0) });

export const phone_stop = () => ({ uri: Config.getRNImageUrl('announcer/phone/phone_stop.png', 1) });

export const phone_modal = () => ({ uri: Config.getRNImageUrl('announcer/phone/phone_modal.png', 0) });


/**
 * Evaluation
 */
export const star_full = () => ({ uri: Config.getRNImageUrl('announcer/evaluation/star_full.png', 0) });

export const star_empty = () => ({ uri: Config.getRNImageUrl('announcer/evaluation/star_empty.png', 0) });

export const ic_chacha = () => ({ uri: Config.getRNImageUrl('announcer/evaluation/ic_chacha.png', 0) });


/**
 * Exit
 */
export const phone_minify = () => ({ uri: Config.getRNImageUrl('announcer/exit/phone_minify.png', 0) });

export const phone_exit = () => ({ uri: Config.getRNImageUrl('announcer/exit/phone_exit.png', 0) });


/**
 * 通话记录
 */
export const item_bg = () => ({ uri: Config.getRNImageUrl('announcer/phoneRecord/item_bg.png', 0) });

/**
 * 在房间时来电dialog
 */
export const dialog_bg = () => ({ uri: Config.getRNImageUrl('announcer/phoneDialog/dialog_bg.png', 1) });

export const cir_phone_start = () => ({ uri: Config.getRNImageUrl('announcer/phoneDialog/phone_start.png', 1) });

export const cir_phone_stop = () => ({ uri: Config.getRNImageUrl('announcer/phoneDialog/phone_stop.png', 1) });