'use strict';

import React, { PureComponent } from "react";
import { ImageBackground, View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import { bg_chat_hall, ic_sanjiao } from "../../hardcode/skin_imgs/main";
import ChatHallModel from "../../model/chat/ChatHallModel";
import Config from "../../configs/Config";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_CHAT_HALL } from "../../hardcode/HLogicEvent";

export default class _ChatHallEnterItem extends PureComponent {

    constructor(props) {
        super(props)

        this._allData = []
        this._showData = []
        this._lastId = ''

        this._loadData()

    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_CHAT_HALL, this._newMessage)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_CHAT_HALL, this._newMessage)
    }

    _newMessage = (data) => {
        this._allData.unshift(data.message)
    }

    _loadData = () => {

        ChatHallModel.getLatestMessageList('', 100)
            .then(data => {
                if (data) {

                    // for (let i = 0; i <= data.length - 1; i++) {
                    //     this._allData.unshift(data[i])

                    // }

                    this._allData = data

                    if (this._allData.length > 2) {
                        const vo1 = this._allData.shift()
                        this._showData.unshift(vo1)
                        this._allData.push(vo1)


                        const vo2 = this._allData.shift()
                        this._showData.unshift(vo2)
                        this._allData.push(vo2)


                        // const vo3 = this._allData.shift()
                        // this._showData.unshift(vo3)
                        // this._allData.push(vo3)

                    } else {
                        this._showData = this._allData
                    }

                    this.forceUpdate()

                    setTimeout(() => {
                        this._start()
                    }, 4000);
                }
            })
    }

    _start = () => {
        if (this._allData.length > 0) {
            const vo = this._allData.shift(0)
            this._showData.unshift(vo)
            this._allData.push(vo)

            if (this._showData.length > 2) {
                this._showData.pop()
            }

            this.forceUpdate()
        }

        setTimeout(() => {
            this._start()
        }, 2000);

    }


    _renderItem = ({ item, index }) => {
        if (!item.userBase) {
            return null
        }

        const headUrl = Config.getHeadUrl(item.userBase.userId, item.userBase.logoTime, item.userBase.thirdIconurl)

        // if (index == 0) {
        //     return (
        //         <View
        //             style={{
        //                 maxWidth: DesignConvert.getW(280),
        //                 height: DesignConvert.getH(50),
        //                 marginBottom: DesignConvert.getH(5),
        //                 flexDirection: 'row',
        //                 alignItems: 'center',
        //                 marginStart: DesignConvert.getW(11),
        //             }}
        //         >

        //             <View
        //                 style={{
        //                     width: DesignConvert.getW(35),
        //                     height: DesignConvert.getH(35),
        //                     alignItems: 'center',
        //                     backgroundColor: 'white',
        //                     justifyContent: 'center',
        //                     marginEnd: DesignConvert.getW(4.5),
        //                     borderRadius: DesignConvert.getW(50),
        //                 }}
        //             >

        //                 <Image
        //                     style={{
        //                         position: 'absolute',
        //                         width: DesignConvert.getW(31),
        //                         height: DesignConvert.getH(31),
        //                         borderRadius: DesignConvert.getW(50),
        //                     }}
        //                     source={{ uri: headUrl }}
        //                 />

        //             </View>

        //             <Text
        //                 numberOfLines={1}
        //                 style={{
        //                     maxWidth: DesignConvert.getW(237),
        //                     color: '#FFFFFF',
        //                     fontSize: DesignConvert.getF(11)
        //                 }}
        //             >{item.userNickName}：{item.message}</Text>
        //         </View>
        //     )
        // }

        return (
            <View
                style={{
                    width: DesignConvert.getW(280),
                    marginBottom: DesignConvert.getH(5),
                    flexDirection: 'row',
                }}
            >

                <View
                    style={{
                        backgroundColor: '#0000004D',
                        borderRadius: DesignConvert.getW(30),
                        height: DesignConvert.getH(22),
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingEnd: DesignConvert.getW(7.5),
                    }}
                >

                    <View
                        style={{
                            width: DesignConvert.getW(22),
                            height: DesignConvert.getH(22),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: item.userBase.sex == 2 ? '#FF6DC8' : '#00BCFF',
                            borderRadius: DesignConvert.getW(15),
                            marginEnd: DesignConvert.getW(4.5),
                        }}
                    >

                        <Image
                            style={{
                                position: 'absolute',
                                width: DesignConvert.getW(18),
                                height: DesignConvert.getH(18),
                                borderRadius: DesignConvert.getW(10),
                            }}
                            source={{ uri: headUrl }}
                        />

                    </View>

                    <Text
                        numberOfLines={1}
                        style={{
                            color: '#FFFFFF',
                            maxWidth: DesignConvert.getW(250),
                            fontSize: DesignConvert.getF(11),
                        }}
                    >{item.userNickName}:{item.message}</Text>
                </View>

                <View
                    style={{
                        flex: 1
                    }}
                />



            </View >
        )
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.swidth,
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    marginTop: DesignConvert.getH(10),
                }}
                onPress={() => {
                    require('../../router/level2_router').showChatHallView()
                }}
            >



                <ImageBackground
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(100),
                        paddingLeft: DesignConvert.getW(11),
                    }}
                    source={bg_chat_hall()}
                >
                    <View
                        style={{
                            height: DesignConvert.getH(30),
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                                // width: DesignConvert.getW(345),
                                fontSize: DesignConvert.getF(15),
                                marginTop: DesignConvert.getW(6),
                            }}

                        >公聊大厅</Text>
                    </View>

                    <View
                        style={{
                            height: DesignConvert.getH(70),
                            justifyContent: 'center',

                        }}
                    >

                        <FlatList
                            data={this._showData}
                            renderItem={this._renderItem}
                            onRefresh={this._loadData}
                            refreshing={false}
                            onScrollToIndexFailed
                            style={{
                                // backgroundColor: 'red',
                                marginTop: DesignConvert.getH(10),
                                // width: DesignConvert.getW(345),
                                flex: 1,
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(9),
                            bottom: DesignConvert.getH(20),
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            require('../../router/level2_router').showChatHallView()
                        }}
                    >

                        {/* <Text
                            style={{
                                color: '#999999',
                                fontWeight: '800',
                                fontSize: DesignConvert.getF(11),
                            }}
                        >{`公聊\n广场`}</Text> */}

                        <Image
                            style={{
                                width: DesignConvert.getW(20),
                                height: DesignConvert.getH(20),
                                resizeMode: 'contain',
                                marginStart: DesignConvert.getW(4),
                            }}
                            source={ic_sanjiao()}
                        />
                    </TouchableOpacity>

                </ImageBackground>
            </TouchableOpacity>
        )
    }
}