'use strict';
import React, { PureComponent } from "react";
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import BaseView from "../base/BaseView";
import LinearGradient from "react-native-linear-gradient";
import FastReplyModel from "../../model/chat/FastReplyModel";
import ToastUtil from "../base/ToastUtil";
import KeyboardAvoidingViewExt from "../base/KeyboardAvoidingViewExt";

export default class EditReplyView extends BaseView {

    constructor(props) {
        super(props)

        this._type = this.props.params.type

        this._title = ''

        if (this._type === 1) {
            this._title = '新增常用语'
            this._message = ''
        } else {
            this._title = '编辑常用语'
            this._message = this.props.params.item.message
        }

        this.state = {
            count: this._message.length,
        }

    }

    _onChangeText = s => {
        this._message = s
        this.state.count = s.length
        this.forceUpdate();
    }

    _submit = () => {
        if (!this._message) {
            ToastUtil.showCenter('内容不能为空')
            return
        }
        if (this._type === 1) {
            //新增
            FastReplyModel.addShortcutMessage(this._message)
                .then(data => {
                    if (data) {
                        this.popSelf()
                    }
                })
        } else {
            //编辑
            FastReplyModel.modifyShortcutMessage(this.props.params.item.id, this._message)
                .then(data => {
                    if (data) {
                        this.popSelf()
                    }
                })
        }

    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#0000001A',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <KeyboardAvoidingViewExt
                    behavior='height'
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(240),
                        backgroundColor: '#FFFFFF',
                        borderRadius: DesignConvert.getW(8),
                        alignItems: 'center',
                    }}
                >

                    <Text
                        style={{
                            color: '#333333',
                            fontWeight: 'bold',
                            width: DesignConvert.getW(315),
                            fontSize: DesignConvert.getF(14),
                            marginTop: DesignConvert.getH(15),
                            marginBottom: DesignConvert.getH(10),
                        }}
                    >
                        {this._title}
                    </Text>

                    <View>

                        <TextInput
                            style={{
                                width: DesignConvert.getW(315),
                                height: DesignConvert.getH(132),
                                textAlign: 'left',
                                textAlignVertical: 'top',
                                borderWidth: DesignConvert.getW(1),
                                borderColor: '#FF4D91',
                                borderRadius: DesignConvert.getW(8),
                            }}
                            multiline={true}
                            maxLength={200}
                            defaultValue={this._message}
                            onChangeText={this._onChangeText}
                        />

                        <Text
                            style={{
                                fontSize: DesignConvert.getF(12),
                                color: '#666666',
                                position: "absolute",
                                bottom: DesignConvert.getH(5.5),
                                right: DesignConvert.getW(11.5),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(12),
                                    color: '#666666',
                                }}
                            >
                                {this.state.count}
                            </Text>

                            {`/200`}
                        </Text>
                    </View>

                    <View

                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: DesignConvert.getH(15),
                        }}
                    >

                        <TouchableOpacity
                            style={{
                                width: DesignConvert.getW(76),
                                height: DesignConvert.getH(29),
                                backgroundColor: '#E9E9E9',
                                borderRadius: DesignConvert.getW(15),
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginEnd: DesignConvert.getW(25),
                            }}
                            onPress={this.popSelf}
                        >

                            <Text
                                style={{
                                    color: '#999999',
                                    fontSize: DesignConvert.getF(13),
                                }}
                            >
                                {`取消`}
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: DesignConvert.getW(76),
                                height: DesignConvert.getH(29),
                                marginStart: DesignConvert.getW(25),
                                borderRadius: DesignConvert.getW(15),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={this._submit}
                        >

                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#FF4D91', '#CB5CFF']}
                                style={{
                                    position: 'absolute',
                                    width: DesignConvert.getW(76),
                                    height: DesignConvert.getH(29),
                                    borderRadius: DesignConvert.getW(15),
                                }}
                            />
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: DesignConvert.getF(13),
                                }}
                            >
                                {`确定`}
                            </Text>

                        </TouchableOpacity>


                    </View>
                </KeyboardAvoidingViewExt>

            </View >
        )
    }
}