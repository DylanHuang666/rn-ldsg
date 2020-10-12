/**
 * ReportDialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import ToastUtil from "../base/ToastUtil";

class _Item extends PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{
                    width: DesignConvert.getW(325),
                    height: DesignConvert.getH(46),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "whte",
                }}>
                <Text
                    style={{
                        color: "#1A1A1A",
                        fontSize: DesignConvert.getF(15),
                    }}>{this.props.text}</Text>

                <View
                    style={{
                        width: DesignConvert.getW(325),
                        height: DesignConvert.getBorderWidth(1),
                        backgroundColor: "#F2F2F2",
                        position: "absolute",
                        bottom: 0,
                    }}></View>
            </TouchableOpacity>
        )
    }
}

export default class ReportDialog extends BaseView {
    constructor(props) {
        super(props);
        
    }

    _onBackPress = () => {
        this.popSelf();
    }
    
    _Report = (type) => {
        //举报理由，1-政治敏感内容，2-色情暴力违规，3-诈骗垃圾消息，4-攻击他人恶意挑衅
        require("../../model/userinfo/UserInfoModel").default.reportUser(this.props.params.userId, this.props.params.entrance, type)
            .then(data => {
                if(data) {
                    ToastUtil.showCenter("举报成功");
                }
            });
        this.popSelf();
    }

    render() {
        return(
            <TouchableOpacity
                onPress={this._onBackPress}
                style={styles.bg}
            >
                <View
                    style={{
                        position: "absolute",
                        bottom: DesignConvert.getH(50),
                        flexDirection: "column",
                        alignItems: "center",
                    }}>

                        <View
                            style={{
                                width: DesignConvert.getW(325),
                                backgroundColor: "white",
                                borderRadius: DesignConvert.getW(10),
                                marginTop: DesignConvert.getH(20),
                            }}>
                            
                            <_Item 
                                text={"政治敏感内容"}
                                onPress={() => {
                                    this._Report(1);
                                }}/>
                            
                            <_Item 
                                text={"色情暴力违规"}
                                onPress={() => {
                                    this._Report(2);
                                }}/>
                            
                            <_Item 
                                text={"诈骗垃圾消息"}
                                onPress={() => {
                                    this._Report(3);
                                }}/>
                            
                            <_Item 
                                text={"攻击他人恶意挑衅"}
                                onPress={() => {
                                    this._Report(4);
                                }}/>
                        </View>

                        <View
                            style={{
                                width: DesignConvert.getW(325),
                                height: DesignConvert.getH(46),
                                backgroundColor: "white",
                                borderRadius: DesignConvert.getW(10),
                                marginTop: DesignConvert.getH(20),
                            }}>
                            <_Item 
                                text="取消"
                                onPress={this._onBackPress}/>
                        </View>
                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    bg: {
        width: DesignConvert.swidth,
        height: DesignConvert.sheight,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
})