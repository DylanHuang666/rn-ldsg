/**
 * 房间背景选择界面
 */

'use strict';

import React from 'react';
import { Image, ImageBackground, ScrollView, TouchableOpacity, View } from "react-native";
import Config from '../../configs/Config';
import { ic_bg_selected } from '../../hardcode/skin_imgs/room';
import DesignConvert from '../../utils/DesignConvert';
import BackTitleView from '../base/BackTitleView';
import BaseView from "../base/BaseView";

const COLUMN_COUNT = 3;


// selectedBackgroundId, voiceRoomBackgroundList, recentVoiceRoomBackgroundList, fnOnChoose
export default class RoomBgChooseView extends BaseView {

    constructor(props) {
        super(props)

        this._info = []

        require('./../../model/staticdata/StaticDataModel').getVoiceRoomBackground()
            .then(data => {
                this._info = data
                this.forceUpdate()
            })


    }

    _renderRow(row) {

        const ret = [];
        for (let col = 0; col < COLUMN_COUNT; ++col) {
            const i = row * COLUMN_COUNT + col;
            const info = this._info[i];
            if (!info) break;

            ret.push(
                <TouchableOpacity
                    key={i}
                    style={{
                        marginTop: DesignConvert.getH(10),
                        marginLeft: DesignConvert.getW(15),
                    }}
                    onPress={() => {
                        if (this.props.params.selectedBackgroundId == info.backgroundid) return;
                        this.props.params.fnOnChoose(info);
                        this.popSelf();
                    }}
                >
                    <ImageBackground

                        style={{
                            width: DesignConvert.getW(105),
                            height: DesignConvert.getH(140),
                            borderRadius: DesignConvert.getW(5),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        source={{ uri: Config.getVoiceRoomBackgroundUrl(info.backgroundid, info.updatetime, true) }}
                    >
                        {
                            info.backgroundid == this.props.params.selectedBackgroundId
                                ? (
                                    <Image
                                        style={{
                                            width: DesignConvert.getW(28),
                                            height: DesignConvert.getH(28),
                                        }}
                                        source={ic_bg_selected()}
                                    />
                                ) : (
                                    null
                                )
                        }
                    </ImageBackground>
                </TouchableOpacity>

            )
        }


        return ret;
    }

    _renderRows() {
        if (!this._info || this._info.length == 0) {
            return null;
        }

        const ret = [];

        const rowCount = Math.ceil(this._info.length / COLUMN_COUNT);
        for (let row = 0; row < rowCount; ++row) {
            ret.push(
                <View
                    key={row}
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    {this._renderRow(row)}
                </View>
            )
        }


        return ret;
    }

    render() {

        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <BackTitleView
                    titleText='房间背景'
                    onBack={this.popSelf}
                />

                <ScrollView
                    style={{
                        flex: 1,
                        paddingTop: DesignConvert.getH(5),
                        paddingBottom: DesignConvert.addIpxBottomHeight(),
                    }}
                >
                    {this._renderRows()}
                </ScrollView>
            </View>
        )
    }
}