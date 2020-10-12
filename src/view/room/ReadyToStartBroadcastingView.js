/**
 * 开播设置
 */
'use strict';

import React, { PureComponent } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Config from '../../configs/Config';
import { bg_ready, ic_close } from '../../hardcode/skin_imgs/ready';
import { camera } from '../../hardcode/skin_imgs/room';
import DesignConvert from '../../utils/DesignConvert';
import BaseView from "../base/BaseView";
import ToastUtil from '../base/ToastUtil';
import RoomNameInputItem from './ready/RoomNameInputItem';
import RoomNoticeInputItem from './ready/RoomNoticeInputItem';
import RoomStartButtonItem from './ready/RoomStartButtonItem';
import RoomTypesListView from './ready/RoomTypesListView';

class CloseBtnItem extends PureComponent {

    render() {
        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: DesignConvert.getW(15),
                    top: DesignConvert.statusBarHeight + DesignConvert.getH(12),
                }}
                onPress={this.props.fnClose}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(21),
                        height: DesignConvert.getH(21),
                    }}
                    source={ic_close()}
                />
            </TouchableOpacity>
        )
    }
}

class RoomCoverItem extends PureComponent {

    render() {
        if (!this.props.roomHeadUri) {
            return (
                <View
                    style={{
                        width: DesignConvert.getW(90),
                        height: DesignConvert.getH(90),

                        backgroundColor: '#D8D8D8',

                        borderRadius: DesignConvert.getW(12),

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >

                    <Image
                        style={{
                            width: DesignConvert.getW(34),
                            height: DesignConvert.getH(34),
                        }}
                        source={camera()}
                    />

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(5),

                            color: 'white',
                            fontSize: DesignConvert.getF(12),
                        }}
                    >上传封面</Text>
                </View>
            );
        }
        return (
            <Image
                style={{
                    width: DesignConvert.getW(90),
                    height: DesignConvert.getH(90),

                    borderRadius: DesignConvert.getW(12),
                }}
                source={this.props.roomHeadUri}
            />
        );
    }
}

export default class ReadyToStartBroadcastingView extends BaseView {

    constructor(props) {
        super(props);

        this._bAgree = true;

        this._voiceRoomBackgroundList = null;
        this._recentVoiceRoomBackgroundList = null;
        this._iRoomTypeList = null;
        this._selectIndex = 0;
        this._selectData = null;
    }

    componentDidMount() {
        super.componentDidMount();

        require('../../model/room/ReadyToStartBroadcastingModel').default.getInfo()
            .then(data => {
                if (!data) return;

                this._voiceRoomBackgroundList = data.voiceRoomBackgroundList;
                this._recentVoiceRoomBackgroundList = data.recentVoiceRoomBackgroundList;
                this._iRoomTypeList = data.iRoomTypeList;
                this._selectIndex = data.selectIndex;
                this._selectData = this._iRoomTypeList[this._selectIndex];
                this.forceUpdate();
            });
    }

    onResume(prevView) {
        //判定是否上一个界面是直播间,如果是就关闭自己拉
        if (require('../../router/level2_router').isLiveRoomView(prevView)) {
            this.popSelf();
        }
    }

    _onChangeRoomIcon = async () => {
        if (!this._selectData) return;

        const selectData = this._selectData;
        let data = await require("../../model/PermissionModel").checkUploadPhotoPermission();
        if (data) {
            let image = await ImagePicker.openPicker({
                mediaType: "photo",
                width: 400,
                height: 400,
                cropping: true,
            });
            selectData.setRoomHeadUri({ uri: image.path });
            this.forceUpdate();
        }
    }

    _onChangeBg = () => {
        if (!this._selectData) return;

        require('../../router/level3_router').showRoomBgChooseView(
            this._selectData.background.backgroundid,
            this._onChooseBg
        );
    }

    _onChooseBg = (bg) => {
        if (this._selectData.background.backgroundid == bg.backgroundid) return;
        if (!this._voiceRoomBackgroundList) return;

        let find = null;
        for (const info of this._voiceRoomBackgroundList) {
            if (info.backgroundid == bg.backgroundid) {
                find = info;
                break;
            }
        }
        if (!find) return;

        this._selectData.background = find;
        this.forceUpdate();
    }

    _onChangeRoomName = s => {
        this._selectData && (this._selectData.roomName = s);
        this.forceUpdate();
    }

    _onChangeRoomNotice = s => {
        this._selectData && (this._selectData.notice = s);
        this.forceUpdate();
    }

    _onChangeRoomType = (index, data) => {
        if (this._selectIndex == index) {
            return;
        }

        this._selectIndex = index;
        this._selectData = data;
        this.forceUpdate();
    }

    _onAgree = () => {
        this._bAgree = !this._bAgree;
        this.forceUpdate();
    }

    _onStart = () => {
        if (!this._bAgree) return ToastUtil.showCenter('请阅读并勾选用户许可协议')

        require('../../model/room/ReadyToStartBroadcastingModel').default.start(
            this._selectData,
            this._selectData.getUploadRoomHeadUrl()
        );
    }

    _onOpenAgree = () => {
        // alert('todo: 打开协议');
    }

    render() {
        const roomName = this._selectData ? this._selectData.roomName : '';
        const roomNotice = this._selectData ? this._selectData.notice : '';
        const roomBg = this._selectData && this._selectData.background
            ? { uri: Config.getVoiceRoomBackgroundUrl(this._selectData.background.backgroundid, this._selectData.background.updatetime, true) }
            : null;
        const roomHeadUri = this._selectData && this._selectData.getRoomHeadUri(DesignConvert.toPixel(70));

        return (
            <ImageBackground
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                }}
                source={bg_ready()}
            >
                <CloseBtnItem
                    fnClose={this.popSelf}
                />

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: DesignConvert.statusBarHeight + DesignConvert.getH(64),
                        left: DesignConvert.getW(34),
                    }}
                    onPress={this._onChangeRoomIcon}
                >
                    <RoomCoverItem
                        roomHeadUri={roomHeadUri}
                    />
                </TouchableOpacity>

                <Text
                    style={{
                        position: 'absolute',
                        top: DesignConvert.statusBarHeight + DesignConvert.getH(69),
                        left: DesignConvert.getW(144),

                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(14),
                    }}
                >选择房间类型</Text>

                <View
                    style={{
                        position: 'absolute',
                        top: DesignConvert.statusBarHeight + DesignConvert.getH(99 - 10),
                        left: DesignConvert.getW(144 - 8),
                    }}
                >
                    <RoomTypesListView
                        datas={this._iRoomTypeList}
                        selectedIndex={this._selectIndex}
                        onChangeRoomType={this._onChangeRoomType}
                    />
                </View>

                <RoomNameInputItem
                    selectData={this._selectData}
                    roomName={roomName}
                    onChangeRoomName={this._onChangeRoomName}
                />

                <RoomNoticeInputItem
                    selectData={this._selectData}
                    roomNotice={roomNotice}
                    onChangeRoomNotice={this._onChangeRoomNotice}
                />

                {/* <RoomBgItem
                    roomBg={roomBg}
                    onChangeBg={this._onChangeBg}
                /> */}

                <RoomStartButtonItem
                    onStart={this._onStart}
                />


            </ImageBackground>
        );
    }
}