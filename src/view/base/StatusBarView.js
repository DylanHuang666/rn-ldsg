/**
 * 用于预留状态栏高度的组件
 */

'use strict';

import React, { Component } from "react";
import { View } from "react-native";
import DesignConvert from "../../utils/DesignConvert";

export default class StatusBarView extends Component {

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: require("../../utils/DesignConvert").default.statusBarHeight,
                    ...this.props.style
                }}
            ></View>
        )
    }
}