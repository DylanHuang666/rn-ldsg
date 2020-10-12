/**
 * 普通dialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../../base/BaseView";
import BackTitleView from "../../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import Config from '../../../configs/Config';
import HeadlinesPage from "./HeadlinesPage";

export default class HeadlinesView extends BaseView {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                }}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={["#CCBAFF", "#7AA2FF"]}
                    style={{
                        position: 'absolute',

                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight
                    }}
                />
                <BackTitleView
                    titleText={"欧皇榜"}
                    onBack={this.popSelf}
                    backImgStyle={{
                        tintColor: '#FFFFFF'
                    }}
                    titleTextStyle={{
                        color: '#ffffff'
                    }}
                />

                <HeadlinesPage
                    style={{
                        marginBottom: DesignConvert.addIpxBottomHeight(),
                    }} />
            </View>
        )
    }
}
