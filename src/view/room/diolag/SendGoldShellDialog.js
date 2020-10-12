
/**
 * 直播间转赠
 */

'use strict';


import React, { PureComponent, Component } from "react";
import BaseView from "../../base/BaseView";
import KeyboardAvoidingViewExt from "../../base/KeyboardAvoidingViewExt";
import DesignConvert from "../../../utils/DesignConvert";
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, ImageBackground } from "react-native";
import { COIN_NAME } from "../../../hardcode/HGLobal";
import LinearGradient from "react-native-linear-gradient";
import ToastUtil from "../../base/ToastUtil";
import Config from "../../../configs/Config";

export default class SendGoldShellDialog extends BaseView {

    constructor(props) {
        super(props)

        this._userId = this.props.params.userId
        this._nickName = this.props.params.nickName
        this._headUrl = this.props.params.headUrl
        
        this._amount = ''
        this._payPassword = ''
        this._maxAmount = 0;


        require("../../../model/BagModel").default.getWallet()
            .then(data => {
                this._maxAmount = data.goldShell;
                this.forceUpdate();
            })
    }

    componentDidMount() {
        super.componentDidMount();
        this._initData();
    }

    _initData = () => {   
        if (!this._nickName || !this._headUrl) {
            require("../../../model/userinfo/UserInfoModel").default.getPersonPage(this._userId)
                .then(data => {
                    this._nickName = decodeURI(data.nickName);
                    this._headUrl = Config.getHeadUrl(this._userId, data.logoTime, data.thirdIconurl);
                    this.forceUpdate();
                })
        }
    }

    _submit = () => {
        if (!this._amount) {
            ToastUtil.showCenter('请输入转赠数量')
            return
        }

        if (!this._payPassword) {
            ToastUtil.showCenter('请输入支付密码')
            return
        }

        require('../../../model/mine/MyWalletModel').default.sendGoldShell(this._userId, this._amount, this._payPassword, this._nickName)
            .then(data => {
                if (data) {
                    ToastUtil.showCenter('转赠成功')
                }
                this.popSelf()
            })
    }

    _onChangeAmount = (s) => {
        // console.log("验证数字", parseInt(s));
        if (!parseInt(s)) {
            // console.log("true", this._amount);
            this._amount = '';
        } else {
            this._amount = parseInt(s) + '';
        }
        this._amount = this._amount > this._maxAmount ? this._maxAmount + "" : this._amount;
        this.forceUpdate();
    }

    _onChangePayPassword = (s) => {
        this._payPassword = s
    }

    _onHistory = () => {
        require("../../../router/level3_router").showRecordView_showOverlay(require("../../anchorincome/RecordView").giftGoldRecord);
    }

    _selectedItem = (item) => {
        this._onChangeAmount(item)
    }

    render() {
        
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <TouchableOpacity
                    onPress={this.popSelf}
                    style={{
                        position: 'absolute',
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight
                    }}
                />

                <ImageBackground
                    source={require("../../../hardcode/skin_imgs/lvdong").wa_zz_bg()}
                    style={{
                        width: DesignConvert.getW(300),
                        height: DesignConvert.getH(408),
                        alignItems: 'center'
                    }}>
                    <Text
                        onPress={this._onHistory}
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(19),
                            left: DesignConvert.getW(15),
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(12)
                        }}>
                        转赠记录
                </Text>
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(17),
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            marginTop: DesignConvert.getH(15),
                            marginBottom: DesignConvert.getH(6)
                        }}
                    >
                        {'转赠'}
                    </Text>
                    <TouchableOpacity
                        onPress={this.popSelf}
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(18),
                            right: DesignConvert.getW(15)
                        }}
                    >
                        <Image
                            source={require("../../../hardcode/skin_imgs/lvdong").set_dialog_close()}
                            style={{
                                width: DesignConvert.getW(18),
                                height: DesignConvert.getH(18)
                            }}
                        />
                    </TouchableOpacity>
                    <Image
                        style={{
                            width: DesignConvert.getW(70),
                            height: DesignConvert.getH(70),
                            borderRadius: DesignConvert.getW(10),
                            marginTop: DesignConvert.getH(9)
                        }}
                        source={{ uri: this._headUrl }}
                    />
                    <Text
                        style={{                          
                            fontSize: DesignConvert.getF(12),
                            color: '#EBEBEB',
                            marginTop: DesignConvert.getH(8)
                        }}
                    >
                        昵称:{this._nickName}
                    </Text>
                    <Text
                        style={{                          
                            fontSize: DesignConvert.getF(10),
                            color: '#EBEBEB',
                            marginTop: DesignConvert.getH(5)
                        }}
                    >
                        ID:{this._userId}
                    </Text>
                    <Text
                        style={{                          
                            fontSize: DesignConvert.getF(12),
                            color: '#FFFFFF',
                            marginTop: DesignConvert.getH(5)
                        }}
                    >
                        金币余额:{this._maxAmount}
                    </Text>
                    <Text
                        style={{
                            width: DesignConvert.getW(240),
                            color: "rgba(255, 255, 255, 1)",
                            fontSize: DesignConvert.getF(12),
                            paddingBottom: DesignConvert.getH(5),
                            paddingTop: DesignConvert.getH(10)
                        }}>转赠数量(金币)</Text>
                    <TextInput
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(34),
                            borderRadius: DesignConvert.getW(10),
                            color: "#333333",
                            backgroundColor: '#FFFFFF',
                            fontSize: DesignConvert.getF(14),
                            padding: 0,
                            paddingLeft: DesignConvert.getW(10),
                        }}
                        value={this._amount}
                        keyboardType="numeric"
                        underlineColorAndroid="transparent"
                        placeholder="请输入转增数量"
                        placeholderTextColor="rgba(198, 198, 198, 1)"
                        returnKeyType='next'
                        onChangeText={this._onChangeAmount}
                    ></TextInput>
                    <Text
                        style={{
                            width: DesignConvert.getW(240),
                            color: "rgba(255, 255, 255, 1)",
                            fontSize: DesignConvert.getF(12),
                            paddingBottom: DesignConvert.getH(5),
                            paddingTop: DesignConvert.getH(10)
                        }}>支付密码</Text>
                    <TextInput
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(34),
                            borderRadius: DesignConvert.getW(10),
                            color: "#333333",
                            backgroundColor: '#FFFFFF',
                            fontSize: DesignConvert.getF(14),
                            padding: 0,
                            paddingLeft: DesignConvert.getW(10),

                        }}
                        // value={this._payPassword}
                        keyboardType="numeric"
                        underlineColorAndroid="transparent"
                        placeholder="请输入支付密码"
                        placeholderTextColor="#DCDCDC"
                        returnKeyType='next'
                        onChangeText={this._onChangePayPassword}
                        secureTextEntry={true}
                    ></TextInput>
                    <TouchableOpacity
                        onPress={this._submit}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={['rgba(255, 82, 69, 1)', 'rgba(205, 0, 49, 1)']}
                            style={{
                                width: DesignConvert.getW(160),
                                height: DesignConvert.getH(44),
                                borderRadius: DesignConvert.getW(22),
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: DesignConvert.getH(18),
                            }}
                        >
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: DesignConvert.getF(14),
                                }}>
                                {"确认转赠"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )
    }

    // render() {

    //     return (
    //         <TouchableOpacity
    //             onPress={this.popSelf}
    //         >
    //             <KeyboardAvoidingViewExt
    //                 behavior="height"
    //                 style={{
    //                     width: DesignConvert.swidth,
    //                     height: DesignConvert.sheight,
    //                     backgroundColor: "rgba(0,0,0,0.5)",
    //                     justifyContent: "center",
    //                     alignItems: "center",
    //                 }}
    //             >
    //                 <View
    //                     style={{
    //                         width: DesignConvert.getW(240),
    //                         height: DesignConvert.getH(344),
    //                         backgroundColor: 'white',
    //                         justifyContent: 'center',
    //                         alignItems: 'center',
    //                         borderRadius: DesignConvert.getW(12),
    //                     }}>
    //                     <Text
    //                         style={{
    //                             color: "#000000",
    //                             fontSize: DesignConvert.getF(12),
    //                             position: "absolute",
    //                             top: DesignConvert.getH(18),
    //                         }}>{COIN_NAME}转赠</Text>

    //                     <TouchableOpacity
    //                         style={{
    //                             position: "absolute",
    //                             right: 0,
    //                             top: DesignConvert.getH(7),
    //                         }}
    //                         onPress={this._onHistory}
    //                     >
    //                         <Text
    //                             style={{
    //                                 color: "#000000",
    //                                 fontSize: DesignConvert.getF(9),
    //                                 padding: DesignConvert.getW(12),
    //                             }}>转赠记录</Text>
    //                     </TouchableOpacity>

    //                     <Image
    //                         style={{
    //                             position: 'absolute',
    //                             width: DesignConvert.getW(44),
    //                             height: DesignConvert.getH(44),
    //                             borderRadius: DesignConvert.getW(30),
    //                             top: DesignConvert.getH(48),
    //                         }}
    //                         source={{ uri: this._headUrl }}
    //                     />

    //                     <Text
    //                         style={{
    //                             position: 'absolute',
    //                             top: DesignConvert.getH(96),
    //                             fontSize: DesignConvert.getF(10),
    //                             color: 'black'
    //                         }}
    //                     >
    //                         {this._nickName}
    //                     </Text>

    //                     <Text
    //                         style={{
    //                             position: 'absolute',
    //                             top: DesignConvert.getH(112),
    //                             fontSize: DesignConvert.getF(10),
    //                             color: '#999999'
    //                         }}
    //                     >
    //                         ID：{this._userId}
    //                     </Text>

    //                     <View
    //                         style={{
    //                             position: "absolute",
    //                             top: DesignConvert.getH(140),
    //                             width: DesignConvert.getW(240),
    //                             height: DesignConvert.getH(30),
    //                             paddingStart: DesignConvert.getW(18),
    //                             paddingEnd: DesignConvert.getW(18),
    //                             flexDirection: 'row',
    //                             justifyContent: 'center',
    //                             alignItems: 'center',
    //                         }}
    //                     >

    //                         <TextInput
    //                             style={{
    //                                 width: DesignConvert.getW(180),
    //                                 height: DesignConvert.getH(40),
    //                                 fontSize: DesignConvert.getF(11),
    //                             }}
    //                             value={this._amount}
    //                             keyboardType='numeric'
    //                             underlineColorAndroid="transparent"
    //                             placeholder='转赠数量'
    //                             placeholderTextColor='#BCBDC0'
    //                             returnKeyType='next'
    //                             onChangeText={this._onChangeAmount}
    //                         />

    //                         <Text
    //                             style={{
    //                                 fontSize: DesignConvert.getF(11),
    //                                 color: 'black'
    //                             }}
    //                         >
    //                             {COIN_NAME}
    //                         </Text>

    //                         <View
    //                             style={{
    //                                 height: DesignConvert.getH(0.5),
    //                                 backgroundColor: '#BCBDC0',
    //                                 position: 'absolute',
    //                                 start: 0,
    //                                 end: 0,
    //                                 bottom: 0,
    //                                 marginStart: DesignConvert.getW(18),
    //                                 marginEnd: DesignConvert.getW(18),
    //                             }}
    //                         />
    //                     </View>

    //                     <Text
    //                         style={{
    //                             fontSize: DesignConvert.getF(11),
    //                             color: 'black',
    //                             position: 'absolute',
    //                             top: DesignConvert.getH(189),
    //                             left: DesignConvert.getW(18)
    //                         }}
    //                     >可选转赠数量</Text>

    //                     <DataList
    //                         selectedItem={this._selectedItem}
    //                     />

    //                     <View
    //                         style={{
    //                             position: "absolute",
    //                             top: DesignConvert.getH(240),
    //                             width: DesignConvert.getW(240),
    //                             height: DesignConvert.getH(30),
    //                             paddingStart: DesignConvert.getW(18),
    //                             paddingRight: DesignConvert.getW(18),
    //                         }}
    //                     >

    //                         <TextInput
    //                             style={{
    //                                 height: DesignConvert.getH(40),
    //                                 fontSize: DesignConvert.getF(11),
    //                             }}
    //                             keyboardType="numeric"
    //                             underlineColorAndroid="transparent"
    //                             placeholder='支付密码'
    //                             placeholderTextColor='#BCBDC0'
    //                             returnKeyType='next'
    //                             secureTextEntry={true}
    //                             onChangeText={this._onChangePayPassword}
    //                         />

    //                         <View
    //                             style={{
    //                                 height: DesignConvert.getH(0.5),
    //                                 backgroundColor: '#BCBDC0',
    //                                 position: 'absolute',
    //                                 start: 0,
    //                                 end: 0,
    //                                 bottom: 0,
    //                                 marginStart: DesignConvert.getW(18),
    //                                 marginEnd: DesignConvert.getW(18),
    //                             }}
    //                         />
    //                     </View>


    //                     <TouchableOpacity
    //                         style={{
    //                             width: DesignConvert.getW(81),
    //                             height: DesignConvert.getH(30),
    //                             justifyContent: 'center',
    //                             alignItems: 'center',
    //                             position: 'absolute',
    //                             bottom: 0,
    //                             marginBottom: DesignConvert.getH(24)
    //                         }}
    //                         onPress={this._submit}
    //                     >
    //                         <LinearGradient
    //                             start={{ x: 0, y: 0 }}
    //                             end={{ x: 1, y: 0 }}
    //                             colors={['#7479FF', '#B785FF']}
    //                             style={{
    //                                 borderRadius: DesignConvert.getW(8),
    //                                 width: DesignConvert.getW(81),
    //                                 height: DesignConvert.getH(30),
    //                                 justifyContent: 'center',
    //                                 alignItems: 'center',
    //                             }}
    //                         >
    //                             <Text
    //                                 style={{
    //                                     color: 'white',
    //                                     fontSize: DesignConvert.getF(12)
    //                                 }}
    //                             >确 认</Text>

    //                         </LinearGradient>


    //                     </TouchableOpacity>
    //                 </View>
    //             </KeyboardAvoidingViewExt >

    //         </TouchableOpacity>
    //     )
    // }

}


class DataList extends PureComponent {

    constructor(props) {
        super(props)

        this._dataList = ['1000', '2000', '5000', '10000']
        this._selected = this._dataList[0]

    }

    _selectedItem = (item) => {
        this._selected = item

        this.props.selectedItem(item)

        this.forceUpdate()
    }



    render() {
        return (
            <FlatList
                data={this._dataList}
                renderItem={this._renderItem}
                numColumns={4}
                style={{
                    marginTop: DesignConvert.getH(210)
                }}
            />
        )
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this._selectedItem(item)
                }}
                style={{
                    marginStart: DesignConvert.getW(6),
                    marginEnd: DesignConvert.getW(6),
                    width: DesignConvert.getW(42),
                    height: DesignConvert.getH(20),
                    borderColor: this._selected == item ? '#A055FF' : '#999999',
                    borderWidth: DesignConvert.getW(1),
                    borderRadius: DesignConvert.getW(18),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: DesignConvert.getF(10),
                        color: this._selected == item ? '#A055FF' : '#999999',
                    }}
                >{item}</Text>

            </TouchableOpacity>
        )
    }
}