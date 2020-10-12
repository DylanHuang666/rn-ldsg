import { AudioRecorder, AudioUtils } from "react-native-audio"
import Sound from "react-native-sound";


/**
* AudioRecorder.prepareRecordingAtPath(path,option)
* 录制路径
* path 路径
* option 参数
*/
function prepareRecordingPath(path) {
    const option = {
        SampleRate: 44100.0, //采样率
        Channels: 2, //通道
        AudioQuality: 'High', //音质
        AudioEncoding: 'aac', //音频编码
        OutputFormat: 'mpeg_4', //输出格式
        MeteringEnabled: false, //是否计量
        MeasurementMode: false, //测量模式
        AudioEncodingBitRate: 32000, //音频编码比特率
        IncludeBase64: true, //是否是base64格式
        AudioSource: 0, //音频源
    }
    AudioRecorder.prepareRecordingAtPath(path, option)
}

this.state = {
    hasPermission: undefined, //授权状态
    audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac', // 文件路径
    recording: false, //是否录音
    pause: false, //录音是否暂停
    stop: false, //录音是否停止
    currentTime: 0, //录音时长
};


/**
 * 音频录制Model 
 */
const AudioUtil = {

    /**
     * 开始录音
     */
    async _record(audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac', onProgress, onFinished) {
        if (state.recording) {
            return alert('正在录音中...')
        }

        // 请求授权
        AudioRecorder.requestAuthorization()
            .then(isAutohr => {
                if (!isAutohr) {
                    return alert('请前往设置开启录音权限')
                }

                prepareRecordingPath(audioPath)

                //录音进度
                AudioRecorder.onProgress = (data) => {
                    onProgress(data)
                }

                //录音完成
                AudioRecorder.onFinished = (data) => {
                    onFinished(data)
                }

                //开始录音
                try {
                    state.recording = true
                    state.pause = false

                    AudioRecorder.startRecording()
                } catch (error) {
                    console.warn(error)
                }
            })
    },

    /**
     * 暂停录音
     */
    async _pause() {
        if (!state.recording) {
            return alert('当前未录音')
        }

        try {
            await AudioRecorder.pauseRecording()
            state.pause = true
            state.recording = false
        } catch (error) {
            console.warn(error)
        }
    },

    /**
     * 恢复录音
     */
    async _resume() {
        if (!this.state.pause) {
            return alert('录音未暂停')
        }
        try {
            await AudioRecorder.resumeRecording()
            state.pause = false
            state.recording = true
        } catch (error) {
            console.warn(error)
        }
    },

    /**
     * 停止录音
     */
    async _stop() {
        state.stop = true
        state.recording = false
        state.pause = false

        try {
            await AudioRecorder.stopRecording()
        } catch (error) {
            console.warn(error)
        }
    },

    /**
     * 重置数据
     */
    reset() {
        state({
            audioPath: undefined,
            recording: false,
            pause: false,
            stop: false,
            currentTime: 0,
        })
    }

}

export default AudioUtil;