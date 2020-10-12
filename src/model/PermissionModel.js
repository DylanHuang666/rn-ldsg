/**
 * 系统权限逻辑
 */

'use strict';

import { checkMultiple, check, PERMISSIONS, RESULTS, request, requestMultiple } from 'react-native-permissions';
import { Platform } from 'react-native';

function _doCheckShowPermisstionView(permission, status) {
    if (
        RESULTS.UNAVAILABLE == status
        || RESULTS.BLOCKED == status
    ) {
        require('../router/level4_router').showUnavailablePermissionView(permission);
    }
}

async function _doCheckMultiplePermissions(permissions) {
    let statuses = await checkMultiple(permissions);

    let ret = RESULTS.GRANTED;

    for (let i = permissions.length - 1; i >= 0; --i) {
        const p = permissions[i];
        const status = statuses[p];

        _doCheckShowPermisstionView(p, status);

        if (RESULTS.GRANTED != status) {
            ret = status;
        }

        if (
            RESULTS.UNAVAILABLE == status
            || RESULTS.GRANTED == status
            || RESULTS.BLOCKED == status
        ) {
            permissions.splice(i, 1);
        }
    }

    if (permissions.length == 0) {
        return ret;
    }

    statuses = await requestMultiple(permissions);
    for (let i = permissions.length - 1; i >= 0; --i) {
        const p = permissions[i];
        const status = statuses[p];

        if (RESULTS.GRANTED != status) {
            return status;
        }
    }
    return RESULTS.GRANTED;
}

async function _doCheckSinglePermission(permission) {
    const status = await check(permission);

    _doCheckShowPermisstionView(permission, status);

    if (RESULTS.DENIED == status) {
        return await request(permission);
    } else {
        return status
    }
}

/**
 * 检查app需要的基本权限
 * 在登陆，首页的时候调用
 */
export const checkAppBasePermission = async () => {
    if (Platform.OS != 'android') return;
    const permissions = [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE];
    await _doCheckMultiplePermissions(permissions);
}

export const checkVideoRoomPermission = async () => {
    const permissions = Platform.OS == 'android'
        ? [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO]
        : [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    await _doCheckMultiplePermissions(permissions);

}

export const checkAudioRoomPermission = async () => {
    const permission = Platform.OS == 'android'
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;
    return _doCheckSinglePermission(permission);
}

export const checkUploadPhotoPermission = async () => {
    const permissions = Platform.OS == 'android'
        ? [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]
        : [PERMISSIONS.IOS.CAMERA];
    const status = await _doCheckMultiplePermissions(permissions);
    return status == RESULTS.GRANTED;
}

export const checkUploadAudioPermission = async () => {
    const permissions = Platform.OS == 'android'
        ? [PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]
        : [PERMISSIONS.IOS.MICROPHONE];
    const status = await _doCheckMultiplePermissions(permissions);
    return status == RESULTS.GRANTED;
}