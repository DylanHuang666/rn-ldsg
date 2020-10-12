/**
 * 实名认证 上传身份证 审核状态
 */
'use strict';

import React, { PureComponent } from "react";
import { Image, Text, View } from 'react-native';
import {
    ic_status_successful,
    ic_status_ing,
    ic_status_fail,
} from '../../../hardcode/skin_imgs/certification';
import DesignConvert from '../../../utils/DesignConvert';

//审核状态  0:审核中， 1:认证不通过，2:认证通过 -1 还未实名认证
export default class _CertStatusItem extends PureComponent {
    _getStatusImg = () => {
        switch (this.props.status) {
            case 0:
                return ic_status_ing()
            case 1:
                return ic_status_fail()
            case 2:
                return ic_status_successful()
        }
    }

    _getStatusTxt = () => {
        switch (this.props.status) {
            case 0:
                return "提交成功"
            case 1:
                return "审核失败"
            case 2:
                return "审核成功"
        }
    }

    _getStatusDesc = () => {
        switch (this.props.status) {
            case 0:
                return "您的身份信息已提交成功请等待管理员审核..."
            case 1:
                return "您的身份信息审核失败请重新提交审核…"
            case 2:
                return "您的身份信息已审核成功"
        }
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(400),
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                <Image
                    source={this._getStatusImg()}
                    style={{
                        width: DesignConvert.getW(105),
                        height: DesignConvert.getH(105),
                    }}></Image>

                <Text
                    style={{
                        color: "#333333",
                        fontSize: DesignConvert.getF(18),
                        fontWeight: "bold",
                        marginTop: DesignConvert.getH(15),
                    }}>
                    {this._getStatusTxt()}
                </Text>

                <Text
                    style={{
                        color: "#999999",
                        fontSize: DesignConvert.getF(13),
                        marginTop: DesignConvert.getH(6),
                        width: DesignConvert.getW(143),
                        textAlign: "center",
                    }}>
                    {this._getStatusDesc()}
                </Text>
            </View>
        )
    }
}