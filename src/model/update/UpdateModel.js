/**
 * 更新逻辑
 */

'use strict';

import { NativeModules } from 'react-native';
import Config from '../../configs/Config';
import HResultStatus from '../../hardcode/HResultStatus';


function _checkVersion(currentVersions, newVersions) {
    if (newVersions.length != currentVersions.length) {
        return false;
    }

    for (let i = 0; i < currentVersions.length; ++i) {
        const nv = parseInt(newVersions[i]);
        const cv = parseInt(currentVersions[i]);
        if (nv < cv) {
            return false;
        }

        if (nv > cv) {
            return true;
        }
    }

    return false;
}

function _doShowNewestTips(bShowTips) {
    bShowTips &&  require("../../view/base/ToastUtil").default.showCenter("当前已是最新版本");
}

function _checkVersion2(currentVersions, channelInfo, bShowTips) {
    if (!channelInfo) {

        _doShowNewestTips(bShowTips);

        //补丁更新
        require('../file/DownloadModel').checkNewJsbundle();
        return;
    }

    const newVersions = channelInfo.version.split('.');
    if (_checkVersion(currentVersions, newVersions)) {
        if (1 == channelInfo.forceupdate) {
            //强更
            require('../../router/level2_router').showAppVersionUpdatePage(channelInfo);
            return;
        } else if (2 == channelInfo.forceupdate) {
            //软更
            require('../../router/level2_router').showAppVersionUpdatePage(channelInfo);
        } else {
            _doShowNewestTips(bShowTips);
        }
    }

    //补丁更新
    require('../file/DownloadModel').checkNewJsbundle();
}


export async function checkUpdate(bShowTips = false) {
    const channels = await require('../staticdata/StaticDataModel').getChannelInfo();

    if (!channels) {
        bShowTips && require('../ErrorStatusModel').default.showTips(HResultStatus.ERROR_GET_STATIC_DATA);
        return;
    }

    let mobileInfos = Config.mobileInfos;
    if (!mobileInfos) {
        mobileInfos = await Config.getMobileInfosAsync();
    }

    const currentVersions = NativeModules.PackageInfo.versionName.split('.');

    let official;
    for (const channelInfo of channels) {
        // "keys":["channelid","channelname","version","downloadurl","forceupdate","iospaytype","issanbox","desc","newvisitor","oldvisitor"]
        if (!channelInfo) continue;

        if ('official' == channelInfo.channelid) {
            official = channelInfo;
        }

        if (channelInfo.channelid == mobileInfos.channel) {
            _checkVersion2(currentVersions, channelInfo, bShowTips);
            return;
        }
    }

    _checkVersion2(currentVersions, official, bShowTips);
}