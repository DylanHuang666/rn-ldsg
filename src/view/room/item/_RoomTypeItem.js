/*
 * @Author: 
 * @Date: 2020-09-10 18:06:09
 * @LastEditors: your name
 * @LastEditTime: 2020-09-14 11:16:09
 * @Description: file content
 */

'use strict';

import React, { PureComponent } from "react";
import { Image, View, Text } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";

export default class _RoomTypeItem extends PureComponent {

    componentDidMount() {
        this._getRoomType();
    }

    _getRoomType = async () => {
        this._roomType = await require('../../../model/room/RoomModel').default.getRoomType(this.props.typeId)
        if (this._isCompUnmount) return;

        this.forceUpdate();
    }

    componentWillUnmount() {
        this._isCompUnmount = true
    }

    render() {
        return (
            <View
                style={{
                    height: DesignConvert.getH(17),
                    width:DesignConvert.getW(34),
                    borderRadius: DesignConvert.getW(9),
                    borderWidth: DesignConvert.getW(1),
                    borderColor: '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: DesignConvert.getW(5),
                }}
            >

                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(10),
                    }}
                >{this._roomType}</Text>
            </View>
        );
    }
}