'use strict';
import HResultStatus from "../../hardcode/HResultStatus";
import { SoundDownloader, getSoundFilesDownloadedPath } from "../file/DownloadModel";
import { NativeModules } from "react-native";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_UPDATE_MUSIC_PLAY, EVT_UPDATE_ROOM_MUSIC_LIST } from "../../hardcode/HGlobalEvent";

// 音乐库
let _musicLibarary = []

//  我的音乐列表
let _myMusicList = null

// 判定播放或者暂停的状态
let _musicState = false

// 判定音乐是否是第一次播放
let _isFirstPlay = true

// 当前播放的一首歌
let _playingUrl

//播放模式  0 顺序播放 1 歌单循环 2 单曲循环
let _playMode = 0;

//定时器
let timer = null

// 播放歌曲
export const startPlayMusic = (url) => {
    if (!url) return false;

    _playingUrl = url

    _isFirstPlay = false;

    NativeModules.Agora.startAudioMixing(url);

    _musicState = true;

    if (timer) {
        clearInterval(timer)
    }

    timer = setInterval(async () => {

        const a = await NativeModules.Agora.getProgress()

        if (a >= 0.998) {
            // 判断播放模式
            switch (_playMode) {
                case 2:
                    singleCirculation();
                    break;
                case 1:
                    switchNextOrPre(true, _myMusicList, _playingUrl);
                    ModelEvent.dispatchEntity(null, EVT_UPDATE_MUSIC_PLAY, _playingUrl);
                    break;
                default:
                    //顺序播放播放到最后一曲的时候
                    const index = _myMusicList.findIndex(item => {
                        return item.playUrl === _playingUrl;
                    })
                    // 重置音乐播放状态
                    if (index === _myMusicList.length - 1) {
                        _musicState = false;
                        _isFirstPlay = true;
                        ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_MUSIC_LIST, null);
                        alert('列表已播放完毕');
                        clearInterval(timer);
                        return
                    }
                    switchNextOrPre(true, _myMusicList, _playingUrl);
                    ModelEvent.dispatchEntity(null, EVT_UPDATE_MUSIC_PLAY, _playingUrl);
                    break;
            }
        }
    }, 100)

}

// 暂停歌曲
export const playOrSuspend = (bool) => {
    _musicState = bool

    if (_musicState) return NativeModules.Agora.resumeAudioMixing()

    NativeModules.Agora.pauseAudioMixing()

}

//切换歌曲
export const switchNextOrPre = (bool, musiclist, playingUrl) => {
    // 获取当前列表播放序号
    let index = musiclist.findIndex(item => {
        return item.playUrl === playingUrl
    })

    if (index === -1) return

    // console.log('当前播放序列号',index)
    let changeMusicUrl

    // 当播放为首曲或者末曲
    if (bool && index === musiclist.length - 1 || !bool && index === 0) {
        // 判断当前播放模式
        switch (_playMode) {
            case 0:
                changeMusicUrl = playingUrl
                break;
            default:
                changeMusicUrl = index === musiclist.length - 1 ? musiclist[0].playUrl : musiclist[musiclist.length - 1].playUrl
                // console.log('下一首1', changeMusicUrl, musiclist[0])
                break;
        }
    } else {
        // 下一首或者前一首
        changeMusicUrl = bool ? musiclist[index + 1].playUrl : musiclist[index - 1].playUrl
    }
    // console.log('下一首', changeMusicUrl, index, index + 1)

    // console.log('下一首', changeMusicUrl, index + 1)
    startPlayMusic(changeMusicUrl)
}

// 单曲循环
const singleCirculation = () => {
    startPlayMusic(_playingUrl)
}

// 切换播放模式
export const switchMusicPlayModel = (num) => {
    _playMode = num
}

// 删除音乐逻辑处理
export const deletMusic = (downUrl, playUrl) => {
    require('../file/DownloadModel').deleteDownloadFile(downUrl)
    if (playUrl === _playingUrl) {
        NativeModules.Agora.pauseAudioMixing()
        _playingUrl = '';
        _musicState = false;
    }
}


export const musicState = () => {
    return _musicState
}

export const isFirstPlay = () => {
    return _isFirstPlay
}

export const playingUrl = () => {
    return _playingUrl
}

export const playMode = () => {
    return _playMode
}


const MusicModel = {

    /**
     * 获取音乐库
     */
    async getMusicLibrary() {
        const tables = await require('../staticdata/StaticDataModel').getMusicLibaray()

        if (!tables) return

        await new Promise((resolve, reject) => {
            tables.forEach(async (item, index) => {
                let myMusic = await getSoundFilesDownloadedPath([item.downloadURL])
                if (myMusic[item.downloadURL] !== undefined) {
                    // 判断是否下载
                    item.isDoloaded = true
                } else {
                    item.isDoloaded = false
                }
                item.isLoading = false
                if (tables.length - 1 === index) {
                    resolve()
                }
            })
        })
        // console.log('我的音乐列表', tables)
        _musicLibarary = tables;
        return tables
    },

    /**
     * 获取本地音乐表
     */
    async getMyMusicListData() {
        const tables = await require('../staticdata/StaticDataModel').getMusicLibaray()

        let myMusicList = []

        return new Promise((resolve, reject) => {
            tables.forEach(async (item, index) => {
                let myMusic = await getSoundFilesDownloadedPath([item.downloadURL])

                // 增添本地路径属性
                if (myMusic[item.downloadURL] !== undefined) {
                    item.playUrl = myMusic[item.downloadURL]
                    myMusicList.push(item)
                }

                if (tables.length - 1 === index) {
                    _myMusicList = myMusicList
                    resolve(myMusicList)
                    // console.log('我的音乐列表', myMusicList)
                }
            })
        })
    },

    /**
     * 搜索音乐
     * @param {string} userId          用户id
     * @param {string} key             搜索关键字
     * @param {string} lastId          最后一个Id
     * @param {int} row                页大小
     */

    async searchMusic(userId, key, lastId, row) {
        // const tables = await MusicModel.getMusicLibrary()

        if (key === '') return _musicLibarary

        let res = await require("../ServerCmd").CenterCmd_getMusicList({ userId, key, lastId, row })

        if (HResultStatus.Success != res.state) return require("../ErrorStatusModel").default.showTips(res.state);

        if (!res.data.list) return []

        // 提取搜索的音乐id
        const searchId = res.data.list.map(item => {
            return item.id
        })

        // 筛选音乐
        let serarMusicList = _musicLibarary.filter((item, index) => {
            return searchId.indexOf(item.id) !== -1
        })

        return serarMusicList
    },

    /**
     * 下载音乐
     * @param {string} url          下载的url
     * @param {Function} fnProgress 下载进度回调
     * @param {Function} fnComplete 下载完成后回调
     */
    async downLoadMusic(url, fnProgress, fnComplete) {
        const downLoader = new SoundDownloader(url, fnProgress, fnComplete);
        downLoader.download()
    },

}



export default MusicModel