/**
 * 密码输入
 */

'use strict';

import React, { PureComponent } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TextInput, TouchableOpacity, ImageBackground, Keyboard } from "react-native";
import DesignConvert from '../../../utils/DesignConvert';
import { LINEARGRADIENT_COLOR, THEME_COLOR } from '../../../styles';

export default class _PasswordEditItem extends PureComponent {
    constructor(props) {
        super(props);

        this._datas = [];
        for (let i = 0; i < this.props.maxInput; i++) {
            this._datas[i] = i;
        }
    }

    _onChangeData = (s) => {
        if (s.length == this.props.maxInput) {
            Keyboard.dismiss();
        }
        this.props.onChangeData && this.props.onChangeData(s);
    }


    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth - DesignConvert.getW(30),
                    height: DesignConvert.getH(55),
                    borderRadius: DesignConvert.getW(5),
                    marginHorizontal: DesignConvert.getW(15),
                    marginVertical: DesignConvert.getW(6),
                    paddingHorizontal: DesignConvert.getW(15),
                    backgroundColor: "white",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                }}>

                {this.props.title ? (
                    <Text
                        style={{
                            color: "#212121",
                            fontSize: DesignConvert.getF(15),
                            width: DesignConvert.getW(90),
                        }}>{this.props.title}</Text>
                ) : null}


                {this._datas.map((item, i) => {
                    return (
                        <View
                            key={i}
                            style={{
                                width: DesignConvert.getW(40),
                                height: DesignConvert.getH(55),
                                backgroundColor: "white",
                                borderWidth: DesignConvert.getW(1),
                                borderColor: "#CFCFCF",
                                borderRadius: DesignConvert.getW(6),
                                justifyContent: "center",
                                alignItems: "center",
                                marginHorizontal: DesignConvert.getH(7.5),
                            }}>

                            <View
                                style={{
                                    backgroundColor: "#212121",
                                    width: DesignConvert.getW(21),
                                    height: DesignConvert.getH(21),
                                    borderRadius: DesignConvert.getW(21),
                                    display: this.props.data.length > i ? "flex" : "none",

                                }}></View>
                        </View>

                    )
                })}

                <TextInput
                    ref={ref => {
                        this._inputRef = ref;
                    }}
                    style={{
                        color: "#FFFFFF00",
                        textAlign: "left",
                        width: DesignConvert.getW(this.props.maxInput * 54 - 10),
                        height: DesignConvert.getH(55),
                        position: "absolute",
                        letterSpacing: DesignConvert.getH(54),
                    }}
                    // secureTextEntry
                    value={this.props.data}
                    keyboardType={this.props.numerInput ? "numeric" : "default"}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#CFCFCF"
                    returnKeyType='next'
                    maxLength={this.props.maxInput}
                    selectionColor={THEME_COLOR}
                    onChangeText={this._onChangeData}
                ></TextInput>


            </View>
        )
    }
}