/**
 * 送礼物组选择界面
 */

'use strict';

import React from 'react';
import BaseView from "../base/BaseView";
import { TouchableOpacity, View, Text, ImageBackground, TextInput, Image } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import ModelEvent from '../../utils/ModelEvent';
import { EVT_LOGIC_CHOOSE_GIFT_NUM } from '../../hardcode/HLogicEvent';
import {
    select_group_bg,
    select_group_submit,
} from '../../hardcode/skin_imgs/room_gift';
import { THEME_COLOR } from '../../styles';
import ToastUtil from '../base/ToastUtil';


export default class RoomGiftGroupChooseView extends BaseView {
    constructor(props) {
        super(props);

        this._num = "";
    }

    _onChangeNum = s => {
        this._num = s;
    }

    _renderItem(group, desc) {
        if (group == -1) {
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            try {
                                ModelEvent.dispatchEntity(null, EVT_LOGIC_CHOOSE_GIFT_NUM, parseInt(this._num))
                                this.popSelf()
                            } catch (err) {
                                ToastUtil.showCenter("请输入合法数字");
                            }
                        }}>

                        <View
                            style={{
                                width: DesignConvert.getW(15),
                                height: DesignConvert.getH(15),
                                backgroundColor: THEME_COLOR,
                                borderRadius: DesignConvert.getW(15),
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: DesignConvert.getW(12),
                            }}>
                            <Image
                                source={select_group_submit()}
                                style={{
                                    width: DesignConvert.getW(8),
                                    height: DesignConvert.getH(7),
                                }}></Image>
                        </View>
                    </TouchableOpacity>

                    <TextInput
                        numberOfLines={1}
                        style={{
                            fontSize: DesignConvert.getF(11),
                            color: '#B8B8B8',
                            position: "absolute",
                            left: DesignConvert.getW(45),
                        }}
                        defaultValue={this._num}
                        secureTextEntry={this._secureState2}
                        keyboardType="numeric"
                        underlineColorAndroid="transparent"
                        placeholder={desc}
                        placeholderTextColor="#B8B8B8"
                        returnKeyType='next'
                        onChangeText={this._onChangeNum}
                        maxLength={6}
                        selectionColor={THEME_COLOR}
                    ></TextInput>

                </View>
            )
        }
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
                onPress={() => {
                    //todo
                    ModelEvent.dispatchEntity(null, EVT_LOGIC_CHOOSE_GIFT_NUM, group)
                    this.popSelf()
                }}
            >
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(11),
                        marginLeft: DesignConvert.getW(12),
                    }}
                >{group}</Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFFFFF',
                        position: "absolute",
                        left: DesignConvert.getW(45),
                    }}
                >{desc}</Text>

            </TouchableOpacity>
        );
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                }}
                onPress={this.popSelf}
            >
                <View
                    // source={select_group_bg()}
                    style={{
                        width: DesignConvert.getW(101),
                        height: DesignConvert.getH(231),
                        position: 'absolute',
                        bottom: DesignConvert.getH(60),
                        right: DesignConvert.getW(64),

                        backgroundColor: 'rgba(32, 32, 32, 0.95)',

                        // flexDirection: 'column-reverse',
                        paddingBottom: DesignConvert.getH(10),
                    }}
                >

                    {/* {this._renderItem(-1, '其他数额')} */}
                    {this._renderItem(1, '一心一意')}
                    {this._renderItem(10, '十全十美')}
                    {this._renderItem(66, '六六大顺')}
                    {this._renderItem(99, '长长久久')}
                    {this._renderItem(188, '要抱抱')}
                    {this._renderItem(520, '我爱你')}
                    {this._renderItem(1314, '一生一世')}
                </View>
            </TouchableOpacity>
        );
    }
}