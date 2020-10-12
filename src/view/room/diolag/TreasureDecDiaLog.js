/**
 * 房间礼物面板->宝箱说明弹框
 */

'use strict';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import DesignConvert from '../../../utils/DesignConvert';
import BaseView from '../../base/BaseView';


export default class TreasureDecDiaLog extends BaseView {

    constructor(props) {
        super(props)

        this._txt = ''
    }

    componentDidMount() {
        super.componentDidMount()
        this._initData()
    }

    async _initData() {
        const res = await require('../../../model/staticdata/StaticDataModel').getisShowTreasureBoxList()

        if (!res) return

        this._txt = res[0].description

        this.forceUpdate()
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <View
                    style={{
                        width: DesignConvert.getW(310),
                        height: DesignConvert.getH(165),
                        borderRadius: DesignConvert.getW(10),

                        backgroundColor: '#ffffff',

                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            marginTop: DesignConvert.getH(2),

                            color: '#333333',
                            fontSize: DesignConvert.getF(15),
                            fontWeight: 'bold'
                        }}
                    >宝箱说明</Text>
                    <ScrollView
                        style={{
                            width: DesignConvert.getW(265),
                            height: DesignConvert.getH(74),

                        }}
                        contentContainerStyle={{
                            paddingRight: DesignConvert.getW(15)
                        }}
                    >
                        <Text
                            style={{
                                color: '#666666',
                                fontSize: DesignConvert.getF(13)
                            }}
                        >{this._txt}</Text>
                    </ScrollView>
                    <View
                        style={{
                            width: DesignConvert.getW(310),
                            height: DesignConvert.getH(1),

                            backgroundColor: '#F0F0F0'
                        }}
                    />
                    <TouchableOpacity
                        onPress={this.popSelf}
                        style={{
                            flex: 1,

                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: '#222222',
                                fontSize: DesignConvert.getF(15)
                            }}
                        >我知道了</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}