/**
 * 房间在线列表
 */

'use strict';

import React, { PureComponent } from "react";
import { FlatList, Text, View, Image, TouchableOpacity, ImageBackground } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import RoomInfoCache from "../../../../cache/RoomInfoCache";
import LinearGradient from "react-native-linear-gradient";
import SexAgeWidget from "../../../userinfo/SexAgeWidget";
import UserInfoCache from "../../../../cache/UserInfoCache";


export default class _RoomOnlinePage extends PureComponent {

    constructor(props) {
        super(props);

        this._list = [];
        this.start = 1;

        this._loadMoreEnable = true;
    }

    componentDidMount() {
        this.start = 1;
        this._roomId = RoomInfoCache.roomId;
        this._initData();
    }

    _loadMore = () => {
        if (this._loadMoreEnable) {
            this._initData();
        }
    }

    _initData() {
        if (!this._roomId) {
            return;
        }
        require("../../../../model/room/RoomManagerModel").default.getOnlineMembers(this._roomId, this.start)
            .then(data => {
                if (this.start == 1) {
                    this._list = data;
                } else {
                    this._list = this._list.concat(data);
                }
                // console.log("在线人员", data);
                // this._list = [{base: {userId: "7529881", nickName: "活泼的北极熊", logoTime: 72478346, thirdIconurl: "84", sex: 2, age: 26, contributeLv: 1}, onMic: true}, {base: {userId: "7529881", nickName: "活泼的北极熊", logoTime: 72478346, thirdIconurl: "84", sex: 1, age: 26, contributeLv: 1}, onMic: false}]
                this._loadMoreEnable = data.length != 0;
                this.start += 22;
                this.forceUpdate();
            })
    }

    
    // _onSelfMicDown = () => {
    //     //todo
    //     alert('todo:自己下麦');
    //     // require('../../../../model/room/RoomModel').default.action(ERoomActionType.MIC_DOWN, UserInfoCache.userId, this._position, 'true');
    // }

    _renderOpBtn(item) {

        const roomData = RoomInfoCache.roomData;
        if (!roomData) {
            return null;
        }

        //房主
        if (UserInfoCache.userId == roomData.createId) {
            //自己不用操作了
            if (item.base.userId == UserInfoCache.userId) {
                return null;
            }

            if (!require("../../../../model/room/RoomModel").isUserOnSeat(item.base.userId)) {
                return (
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(23),
                            top: DesignConvert.getH(8),
                        }}
                        onPress={() => {
                            // alert('todo: 抱她上麦')
                            require("../../../../model/room/MicQueModel").default.upMicUser(item.base.userId);
                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#FFB300', '#FFDC00']}
                            style={{
                                width: DesignConvert.getW(75),
                                height: DesignConvert.getH(35),

                                justifyContent: 'center',
                                alignItems: 'center',

                                borderRadius: DesignConvert.getW(40),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(12),
                                    color: 'white',
                                }}
                            >抱TA上麦</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                );
            }
            return null;
        }

        // //自己
        // if (
        //     item.base.userId == UserInfoCache.userId
        //     && require("../../../../model/room/RoomModel").isUserOnSeat(item.base.userId)
        // ) {
        //     //下麦
        //     return (
        //         <TouchableOpacity
        //             style={{
        //                 position: 'absolute',
        //                 right: DesignConvert.getW(23),
        //                 top: DesignConvert.getH(8),
        //             }}
        //             onPress={this._onSelfMicDown}
        //         >
        //             <View
        //                 style={{
        //                     width: DesignConvert.getW(60),
        //                     height: DesignConvert.getH(35),

        //                     justifyContent: 'center',
        //                     alignItems: 'center',

        //                     backgroundColor: '#FFFFFF10',
        //                     borderRadius: DesignConvert.getW(30),
        //                 }}
        //             >
        //                 <Text
        //                     style={{
        //                         fontSize: DesignConvert.getF(12),
        //                         color: 'white',
        //                     }}
        //                 >下麦</Text>
        //             </View>
        //         </TouchableOpacity>
        //     );
        // }



        return null;
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    require("../../../../router/level2_router").showUserInfoView(item.base.userId);
                }}
                style={{
                    marginTop: DesignConvert.getH(25),
                    marginLeft: DesignConvert.getW(23),

                    flexDirection: "row",
                    width: DesignConvert.getW(350),
                    height: DesignConvert.getH(50),
                    alignItems: "center",
                }}
            >

                <View>
                    <Image
                        source={{ uri: require("../../../../configs/Config").default.getHeadUrl(item.base.userId, item.base.logoTime, item.base.thirdIconurl) }}
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(50),
                            borderRadius: DesignConvert.getW(25),
                        }}
                    />
                    {RoomInfoCache.createUserInfo && RoomInfoCache.createUserInfo.userId === item.base.userId ?
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#F6937B', '#F86090']}
                            style={{
                                position: 'absolute',
                                left: DesignConvert.getW(5),
                                bottom: 0,

                                width: DesignConvert.getW(40),
                                height: DesignConvert.getH(15),

                                borderRadius: DesignConvert.getW(15),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: DesignConvert.getF(8),
                                }}
                            >
                                {'房主'}
                            </Text>
                        </LinearGradient>
                        : null
                    }
                </View>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        marginLeft: DesignConvert.getW(7.5),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(10),
                            }}
                        >{decodeURI(item.base.nickName)}</Text>

                        <SexAgeWidget
                            style={{
                                marginLeft: DesignConvert.getW(2),
                            }}
                            sex={item.base.sex}
                            age={item.base.age}
                        />
                    </View>


                    <View
                        style={{
                            marginTop: DesignConvert.getW(6),
                            flexDirection: "row",
                        }}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF80',
                                fontSize: DesignConvert.getF(11),
                            }}
                        >ID：{item.base.userId}</Text>
                    </View>
                </View>

                {this._renderOpBtn(item)}
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item, index) => item.base.userId;


    render() {
        return (
            <View
                style={{
                    flex: 1,
                    // backgroundColor: '#00000000',
                }}
            >
                <View
                    style={{
                        marginLeft: DesignConvert.getW(23),

                        flexDirection: 'row',
                        // justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: "#FFFFFF",
                            fontSize: DesignConvert.getF(15),
                        }}
                        includeFontPadding={false}
                    >房间在线</Text>

                    <Text
                        style={{
                            color: "#FFFFFF80",
                            fontSize: DesignConvert.getF(13),
                        }}
                    >({this._list.length})</Text>
                </View>

                <FlatList
                    data={this._list}
                    renderItem={this._renderItem}
                    onEndReached={this._loadMore}
                    onEndReachedThreshold={0.2}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                />

            </View>
        )
    }
}