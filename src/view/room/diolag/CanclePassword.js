import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import DesignConvert from "../../../utils/DesignConvert";
import BaseView from "../../base/BaseView";
import { diolag_lock } from "../../../hardcode/skin_imgs/room";
import { ERoomModify } from '../../../hardcode/ERoom';
import LinearGradient from "react-native-linear-gradient";

export default class CanclePassword extends BaseView {
    constructor(props) {
        super(props)
    }

    _onCancelPress = () => {
        this.popSelf();
    }

    _onSurePress = () => {
        require('../../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_PASSWORD_KEY, '')
            .then(data => {
                if (data) {
                    // console.log("房间解锁成功", data)
                    this.popSelf();
                }
            })
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, .6)"
                }}
            >
                <View
                    style={{
                        width: DesignConvert.getW(300),
                        height: DesignConvert.getH(165),
                        backgroundColor: "#FFFFFF",
                        borderRadius: DesignConvert.getW(10),
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            marginTop: DesignConvert.getH(39),
                            fontSize: DesignConvert.getF(17),
                            color: '#333333',
                            fontWeight: 'bold',
                        }}
                    >{`是否确定取消房间密码？`}</Text>

                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(100),
                            height: DesignConvert.getH(44),
                            marginRight: DesignConvert.getW(8),
                            borderRadius: DesignConvert.getW(30),
                            justifyContent: "center",
                            borderWidth: DesignConvert.getW(1),
                            borderColor: '#FF95A4',
                            alignItems: "center",
                            position: 'absolute',
                            left: DesignConvert.getW(35),
                            bottom: DesignConvert.getH(28.5),
                        }}
                        onPress={this._onCancelPress}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(13),
                                color: '#FF95A4'
                            }}
                        >{`取消`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(100),
                            height: DesignConvert.getH(44),
                            justifyContent: "center",
                            alignItems: "center",
                            position: 'absolute',
                            right: DesignConvert.getW(35),
                            bottom: DesignConvert.getH(28.5),
                        }}
                        onPress={this._onSurePress}
                    >

                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#CD5BFB', '#FD4E95']}
                            style={{
                                width: DesignConvert.getW(100),
                                height: DesignConvert.getH(44),
                                borderRadius: DesignConvert.getW(30),
                            }}
                        />

                        <Text
                            style={{
                                position: 'absolute',
                                fontSize: DesignConvert.getF(13),
                                color: "#FFFFFF"
                            }}
                        >确认</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}