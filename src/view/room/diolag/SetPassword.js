import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native';
import DesignConvert from "../../../utils/DesignConvert";
import BaseView from "../../base/BaseView";
import { ERoomModify } from '../../../hardcode/ERoom';
import { enterRoom } from "../../../model/room/RoomPublicScreenModel";
import RoomModel from "../../../model/room/RoomModel";
import LinearGradient from "react-native-linear-gradient";



export default class SetPassword extends BaseView {
    constructor(props) {
        super(props)

        this._type = this.props.params.type
        this._roomId = this.props.params.roomId

        this._passwrod = ''

    }

    _onSurePress = () => {
        if (this._passwrod.length < 4) return alert("请输入完整房间密码")

        if (this._type == 0) {
            //设置密码
            require('../../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_PASSWORD_KEY, this._passwrod)
                .then(data => {
                    if (data) {
                        this.popSelf();
                    }
                })
        } else {
            //输入进房密码
            this.popSelf()
            RoomModel.enterLiveRoom(this._roomId, this._passwrod)
        }

    }

    _nextFocus = (text, index) => {
        if (this.state.textInputData[index].value !== '') {
            // console.log(98797)
        }
        const arr = this.state.textInputData;
        this.setState({
            textInputData: arr.map((item, i) => {
                if (i === index) return {
                    value: text
                }
                return item
            })
        }, () => {
            const index = this.state.textInputData.findIndex(item => item.value === '');
            if (index !== -1) {
                // console.log(6789)
                this.refs['inputRef' + index].focus();
            } else {
                // console.log(6789)
                this.refs['inputRef' + '3'].focus();
            }
        })
    }

    _backFocus = (event, index) => {
        // console.log("被恩下去了")
        // console.log(event.nativeEvent.key)
        // console.log(this.state.textInputData[index])

        if (this.state.textInputData[index].value === '' && index !== 0 && event.nativeEvent.key === "Backspace") {
            // console.log(12345)
            const t = index - 1
            // this.refs['inputRef' + index].blur()
            this.refs['inputRef' + t].focus()
        }
    }

    _onBack = () => {
        this.popSelf()
    }

    _onChangPwd = s => {
        this._passwrod = s
        this.forceUpdate()
    }

    _rederCode = () => {
        return (
            <View
                style={{
                    width: DesignConvert.getW(250),
                    height: DesignConvert.getH(50),

                    paddingHorizontal: DesignConvert.getW(15),

                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >


                {[0, 1, 2, 3].map((item, index) => {
                    return (
                        <View
                            style={{
                                width: DesignConvert.getW(44),
                                height: DesignConvert.getH(44),
                                backgroundColor: 'rgba(120, 120, 120, 0.6)',
                                borderRadius: DesignConvert.getW(12),

                                justifyContent: 'center',
                                alignItems: 'center'

                            }}
                        >
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: DesignConvert.getF(14)
                                }}
                            >{this._passwrod.charAt(index)}</Text>
                        </View>
                    )
                })}


                <TextInput
                    maxLength={4}
                    textAlign="left"
                    style={{

                        position: 'absolute',


                        width: DesignConvert.getW(300),
                        height: DesignConvert.getH(50),
                        // paddingStart: Platform.OS === 'ios' ? DesignConvert.getW(8) : DesignConvert.getW(8),
                        // letterSpacing: Platform.OS === 'ios' ? DesignConvert.getW(57) : DesignConvert.getW(57),
                        color: '#FF95A4',
                        fontSize: DesignConvert.getF(24),
                        // selectionColor: 'red',
                        // backgroundColor: 'red',
                        padding: 0,
                        marginLeft: Platform.OS === 'ios' ? DesignConvert.getW(30) : 0,

                        opacity: 0,
                    }}
                    autoFocus={true}
                    selectionColor='#000000'
                    keyboardType='number-pad'
                    underlineColorAndroid="transparent"
                    returnKeyType='next'
                    onChangeText={this._onChangPwd}
                    defaultValue={this._roomPwd}
                    caretHidden={true}
                // onSubmitEditing={this._onLogin}
                />

            </View>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    marginBottom: DesignConvert.getH(50)
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        width: DesignConvert.getW(250),
                        height: DesignConvert.getH(172),
                        borderRadius: DesignConvert.getW(12),
                        backgroundColor: "rgba(0, 0, 0, 0.9)",

                    }}
                >
                    <Text
                        style={{
                            marginTop: DesignConvert.getH(15),
                            marginBottom: DesignConvert.getH(20),
                            fontSize: DesignConvert.getF(17),
                            color: "#ffffff",

                            fontWeight: 'bold'
                        }}
                    >{this._type == 0 ? '房间上锁' : '房间已上锁'}</Text>

                    {this._rederCode()}
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: DesignConvert.getW(43),
                            justifyContent: 'space-between',

                            width: DesignConvert.getW(250),

                            marginTop: DesignConvert.getH(20)

                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: DesignConvert.getW(65),
                                height: DesignConvert.getH(29),
                                borderRadius: DesignConvert.getW(30),

                                justifyContent: "center",
                                alignItems: "center",


                            }}
                            onPress={this.popSelf}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                colors={['#F6F6F6', '#C6C6C6']}
                                style={{
                                    position: 'absolute',

                                    width: DesignConvert.getW(65),
                                    height: DesignConvert.getH(29),
                                    borderRadius: DesignConvert.getW(30),
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(12),
                                    color: '#787878'
                                }}
                            >{`取消`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: DesignConvert.getW(65),
                                height: DesignConvert.getH(29),
                                borderRadius: DesignConvert.getW(30),

                                justifyContent: "center",
                                alignItems: "center",

                            }}
                            onPress={this._onSurePress}
                        >

                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                colors={['#FF5245', '#CD0031']}
                                style={{
                                    position: 'absolute',

                                    width: DesignConvert.getW(65),
                                    height: DesignConvert.getH(29),
                                    borderRadius: DesignConvert.getW(30),
                                }}
                            />

                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(12),
                                    color: "#FFFFFF"
                                }}
                            >确认</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }
}