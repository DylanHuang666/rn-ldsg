/**
 * 图片配置url
 */

'use strict';

import Config from "./Config";

export const voiceRoomBackgroundUrl = (bgId) => {
    return { uri: Config.getLogoUrl(`voiceroombackgroundthumbnail/${bgId}`) };
}