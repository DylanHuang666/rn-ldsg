'use strict';

import React, { PureComponent } from "react";
import { Image, Text, View } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";

export default class _IDItem extends PureComponent {

    constructor(props) {
        super(props);

        this._cutenumber = null//靓号
        this._cuteIcon = null//靓号icon
        this._doGetData();
    }

    _doGetData() {
        require('../../../model/userinfo/UserInfoModel').default.getGoodId(this.props.id)
            .then(data => {
                if (data) {
                    //设置靓号
                    this._cutenumber = data.cutenumber
                    this._cuteIcon = data.icon
                } else {
                    //没有靓号
                    this._cutenumber = null
                    this._cuteIcon = null
                }
                this.forceUpdate()
            })
        this.forceUpdate();
    }

    _renderCuteImg() {
        if (!this._cuteIcon) {
            return null;
        }

        return (
            <Image
                style={{
                    marginEnd: DesignConvert.getW(5),
                    width: DesignConvert.getW(18),
                    height: DesignConvert.getH(18),
                }}
                source={{ uri: this._cuteIcon }}
            />
        )
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    left: DesignConvert.getW(95),
                    top: DesignConvert.getH(35),

                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >

                {this._renderCuteImg()}

                <Text
                    style={{
                        color: '#FFFFFFCC',
                        fontSize: DesignConvert.getF(12),
                    }}
                >ID:{this._cutenumber ? this._cutenumber : this.props.id}</Text>
            </View>
        );
    }
}