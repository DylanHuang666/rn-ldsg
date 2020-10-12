/**
 * 播放音频Model
 */

import Sound from "react-native-sound";
import RoomInfoCache from "../../cache/RoomInfoCache";
import { NativeModules } from "react-native";
import { ERoomActionType } from "../../hardcode/ERoom";
import UserInfoCache from "../../cache/UserInfoCache";

let whoosh = undefined

let bOpeMic = false;

this.state = {
    pause: false,//是否暂停中

}

const SoundUtil = {

    /**
     * 播放
     */
    _play(path, onEnd) {
        this._stop()
        if(RoomInfoCache.isInRoom) {
            // NativeModules.Agora.enableSpeaker(false);
            NativeModules.Agora.pauseRtcEngine();
            bOpeMic = require('../../model/room/RoomModel').isOpeMic();
            // require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_CLOSE, UserInfoCache.userId, 0, '')
        }
        whoosh = new Sound(path, '', (error) => {
            if (error) {
                return alert(error)
            }
            state.pause = false
            whoosh.play(playEnd => {
                if(RoomInfoCache.isInRoom) {
                    // NativeModules.Agora.enableSpeaker(RoomInfoCache.enableSpeaker);
                    NativeModules.Agora.resumeRtcEngine();
                    require('../../model/room/RoomModel').default.action( bOpeMic ? ERoomActionType.MIC_OPEN : ERoomActionType.MIC_CLOSE, UserInfoCache.userId, 0, '')
                }
                onEnd && onEnd()
            })
        })
    },

    /**
     * 暂停播放
     */
    _pause() {
        if (!whoosh || (whoosh && !whoosh.isPlaying)) {
            return alert('没有正在播放的音频')
        }
        if (whoosh && whoosh.isPlaying()) {
            state.pause = true
            whoosh.pause()
        }
    },

    /**
     * 继续播放
     */
    _resume(onEnd) {
        if (state.pause) {
            if (whoosh) {
                state.pause = false
                whoosh.play(playEnd => {
                    onEnd && onEnd()
                })
            }
        }
    },

    /**
     * 停止播放
     */
    _stop() {
        if(RoomInfoCache.isInRoom) {
            // NativeModules.Agora.enableSpeaker(RoomInfoCache.enableSpeaker);
            NativeModules.Agora.resumeRtcEngine();
            require('../../model/room/RoomModel').default.action( bOpeMic ? ERoomActionType.MIC_OPEN : ERoomActionType.MIC_CLOSE, UserInfoCache.userId, 0, '')
        }
        if (whoosh) {
            whoosh.pause()
            whoosh.stop()
            state.pause = false
        }
    },

    _release() {
        if (whoosh) {
            whoosh.release()
            whoosh = undefined
        }
    }

}

export default SoundUtil;