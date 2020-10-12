/**
 * 退出直播间
 */

'use strict';

import React, { PureComponent } from 'react';
import BaseView from "../base/BaseView";
import { View, ImageBackground, Image, Text, TouchableOpacity } from "react-native";
import DesignConvert from '../../utils/DesignConvert';

function _Item2(props) {
    const { onPress, icon, name, textStyle } = props

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: DesignConvert.getW(72),
                flex: 1,

                flexDirection: "row",
                // justifyContent: "center",
                alignItems: 'center',

                paddingLeft: DesignConvert.getW(12)
            }}>
            {/* <Image
                source={icon}
                style={{
                    width: DesignConvert.getW(15),
                    height: DesignConvert.getH(15),

                    marginRight: DesignConvert.getW(6)
                }}></Image> */}

            <Text
                style={{
                    color: '#FFFFFF',
                    fontSize: DesignConvert.getF(12),

                    ...textStyle
                }}>
                {name}
            </Text>
        </TouchableOpacity>
    )
}

export default class ExitRoomView extends BaseView {

    _onExit = () => {
        this.popSelf();

        const fnCloseCallerView = this.props.params.fnCloseCallerView;
        require('../../model/room/RoomModel').default.leave();
        fnCloseCallerView && fnCloseCallerView();
    }

    _onMinify = () => {
        this.popSelf();

        const fnCloseCallerView = this.props.params.fnCloseCallerView;
        fnCloseCallerView && fnCloseCallerView();
    }

    render() {


        return (
            <TouchableOpacity
                onPress={this.popSelf}
                style={{
                    flex: 1,
                }}>

                <View
                    style={{
                        width: DesignConvert.getW(72),
                        height: DesignConvert.getH(72),
                        borderRadius: DesignConvert.getW(8),
                        backgroundColor: "#000000",

                        alignItems: "center",

                        position: "absolute",
                        top: DesignConvert.getW(56) + DesignConvert.statusBarHeight,
                        right: DesignConvert.getW(10),
                    }}>

                    <View
                        style={{
                            width: DesignConvert.getW(7),
                            height: DesignConvert.getH(7),
                            backgroundColor: "#000000",

                            position: "absolute",
                            top: DesignConvert.getW(-2),
                            right: DesignConvert.getW(10),

                            transform: [{
                                rotate: "45deg"
                            }]
                        }}></View>

                    <_Item2
                        onPress={this._onMinify}
                        name='最小化'
                        // icon={ic_minify()}
                        // textStyle={{
                        //     color: "#FA6381"
                        // }}
                    />

                    {/* <_Item2
                        onPress={this._onOpenMovie}
                        name={RoomInfoCache.isSelfAnimation ? '关闭动效' : '开启动效'}
                        icon={ic_movie_open()}
                    /> */}

                    <_Item2
                        onPress={this._onExit}
                        name='退出房间'
                        // icon={ic_exit()}
                    />

                </View>
            </TouchableOpacity>
        )

        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={this.popSelf}
            >

                <View
                    style={{
                        width: DesignConvert.getW(264),
                        height: DesignConvert.getH(173),
                        backgroundColor: 'white',

                        borderRadius: DesignConvert.getW(10),

                        // borderTopLeftRadius: DesignConvert.getW(10),
                        // borderTopRightRadius: DesignConvert.getW(10),

                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            marginTop: DesignConvert.getH(34),
                            color: '#1A1A1A',
                            fontSize: DesignConvert.getF(15),
                            fontWeight: 'bold',
                        }}
                    >退出直播间</Text>

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(23),
                            color: '#1A1A1A',
                            fontSize: DesignConvert.getF(13),
                        }}
                    >即将离开房间</Text>
                    <Text
                        style={{
                            color: '#1A1A1A',
                            fontSize: DesignConvert.getF(13),
                        }}
                    >是否确认退出？</Text>

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            height: DesignConvert.getH(45),

                            flexDirection: 'row',
                        }}
                    >

                        <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={this._onExit}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: '#F5F5F5',
                                    borderBottomLeftRadius: DesignConvert.getW(10),

                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#1A1A1A',
                                        fontSize: DesignConvert.getF(14),
                                    }}
                                >退出</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={this._onMinify}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: '#7479FF',
                                    borderBottomRightRadius: DesignConvert.getW(10),

                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: DesignConvert.getF(14),
                                    }}
                                >最小化</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>



            </TouchableOpacity>
        );
    }
}