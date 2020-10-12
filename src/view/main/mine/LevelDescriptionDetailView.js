/**
 * 我的 -> 等级 -》 说明
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, ScrollView, ActivityIndicator, Slider } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../../utils/DesignConvert';
import Config from '../../../configs/Config';
import StatusBarView from "../../base/StatusBarView";
import BaseView from '../../base/BaseView';
import { ic_back_black } from "../../../hardcode/skin_imgs/common";
import ToastUtil from "../../base/ToastUtil";
import BackTitleView from "../../base/BackTitleView";
import { COIN_NAME, } from '../../../hardcode/HGLobal';

const [rich, charm] = [233, 666]
export default class LevelDescriptionDetailView extends BaseView {
    constructor(props) {
        super(props);
    }


    render() {
        return(
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                }}>
                
                <BackTitleView
                    titleText="等级说明"
                    onBack={this.popSelf}
                />

                <Text
                    style={{
                        color: "#999999",
                        fontSize: DesignConvert.getF(14),
                        width: DesignConvert.getW(334),
                        marginTop: DesignConvert.getH(20),
                    }}>{`每消费1${COIN_NAME}就能增加1个经验值，随着你的等级上升， 你的等级图标也会相应的颜色变化。`}</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        flex: 1,
                    }}>
                    <Image
                        resizeMode="contain"
                        source={{uri: this.props.params.viewType == rich? require("../../../hardcode/skin_imgs/main").level_rich_detail() : require("../../../hardcode/skin_imgs/main").level_charm_detail()}}
                        style={{
                            width: DesignConvert.getW(315),
                            height: DesignConvert.getH(1815),
                            marginBottom: DesignConvert.getH(27),
                        }}></Image>
                </ScrollView>
            </View>
        )
    }
}