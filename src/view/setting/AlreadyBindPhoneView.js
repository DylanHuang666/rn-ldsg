
/**
 * 已经绑定手机号页面
 * 更换手机号界面
 */

'use strict';

import React from "react";
import { Image, Text, View } from "react-native";
import UserInfoCache from "../../cache/UserInfoCache";
import DesignConvert from "../../utils/DesignConvert";
import BackTitleView from "../base/BackTitleView";
import BaseView from "../base/BaseView";
import { SubmitButton } from "../anchorincome/VerifyPayPasswordView";

export default class AlreadyBindPhoneView extends BaseView {

    _onSubmitPress = () => {
        this.popSelf();
        require("../../router/level3_router").showBindPhoneView();
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',

                    alignItems: 'center',
                }}
            >
                <BackTitleView
                    onBack={this.popSelf}
                    titleText={'手机绑定'}
                    titleTextStyle={{
                        color: '#1D1D1DFF'
                    }}
                />

                <Image
                    style={{
                        marginTop: DesignConvert.getH(40),
                        width: DesignConvert.getW(260),
                        height: DesignConvert.getH(260),
                        resizeMode: 'contain',
                    }}
                    source={require("../../hardcode/skin_imgs/ccc").ic_bind_phone()}
                />

                <Text
                    style={{
                        marginTop: DesignConvert.getH(2.5),
                        fontWeight: 'bold',
                        fontSize: DesignConvert.getF(14),
                        color: '#121212',
                    }}
                >已绑定手机号:+86
                {/* </Text> */}
                    {/* <Text
                    style={{
                        marginTop: DesignConvert.getH(10),

                        fontSize: DesignConvert.getF(20),
                        color: '#1D1D1D',
                    }}
                > */}
                    {UserInfoCache.phoneNumber}
                </Text>
                <SubmitButton
                    style={{
                        // marginTop: DesignConvert.getH(90),
                    }}
                    enable={true}
                    btnText={'更换手机号'}
                    onPress={this._onSubmitPress}
                />
            </View>
        )
    }

}