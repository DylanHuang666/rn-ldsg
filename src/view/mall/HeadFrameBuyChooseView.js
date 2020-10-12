/**
 * 个性商城 -> 头像框 -> 购买价格选择界面
 */
'use strict';

import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { COIN_NAME } from '../../hardcode/HGLobal';
import { ic_diamond } from '../../hardcode/skin_imgs/mywallet';
import DesignConvert from '../../utils/DesignConvert';
import BaseView from "../base/BaseView";


export default class HeadFrameBuyChooseView extends BaseView {

    _renderList() {
        const ret = [];

        for (let i = 0; i < this.props.params.list.length; ++i) {
            const vo = this.props.params.list[i];
            ret.push(
                <TouchableOpacity
                    key={i}
                    style={{
                        width: DesignConvert.getW(130),
                        height: DesignConvert.getH(42),

                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    onPress={() => {
                        this.popSelf();
                        this.props.params.onChoose(vo);
                    }}
                >
                    <Image
                        style={{
                            marginLeft: DesignConvert.getW(16),

                            width: DesignConvert.getW(10),
                            height: DesignConvert.getH(9),
                        }}
                        source={ic_diamond()}
                    />

                    <Text
                        style={{
                            marginLeft: DesignConvert.getW(3),

                            color: '#333333',
                            fontSize: DesignConvert.getF(10),
                        }}
                    >{`${vo.money}${COIN_NAME}/${vo.day}天`}</Text>
                </TouchableOpacity>
            );

            if (i < this.props.params.list.length - 1) {
                ret.push(
                    <View
                        key={i + '_sep'}
                        style={{
                            width: DesignConvert.getW(130),
                            height: DesignConvert.getH(1),

                            backgroundColor: '#F0F0F0',
                        }}
                    />
                )
            }
        }


        return ret;
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
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        bottom: DesignConvert.addIpxBottomHeight() + DesignConvert.getH(45 + 9),

                        width: DesignConvert.getW(130),

                        backgroundColor: 'white',

                    }}
                >
                    {this._renderList()}
                </View>
            </TouchableOpacity>
        )
    }
}