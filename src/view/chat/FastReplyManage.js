/**
 *  聊天 -> 管理常用语
 */
'use strict';

import React, { PureComponent } from "react";
import BaseView from "../base/BaseView";
import { View, FlatList, Text, TouchableOpacity, Image } from "react-native";
import BackTitleView from "../base/BackTitleView";
import DesignConvert from "../../utils/DesignConvert";
import { ic_delete, ic_edit, ic_sort_up, ic_sort_down } from "../../hardcode/skin_imgs/chat";
import FastReplyModel from "../../model/chat/FastReplyModel";
import { EVT_UPDATE_FAST_REPLY } from "../../hardcode/HGlobalEvent";
import ModelEvent from "../../utils/ModelEvent";

export default class FastReplayManage extends BaseView {

    constructor(props) {
        super(props)

        this._sort = false
        this._data = []

        this._initData()
    }

    componentDidMount() {
        super.componentDidMount();
        ModelEvent.addEvent(null, EVT_UPDATE_FAST_REPLY, this._initData)
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        ModelEvent.removeEvent(null, EVT_UPDATE_FAST_REPLY, this._initData)
    }



    _initData = () => {
        FastReplyModel.getShortcutMessageList()
            .then(data => {
                this._data = data
                this.forceUpdate()
            })
    }

    _delte = (id) => {
        FastReplyModel.deleteShortcutMessage(id)
            .then(data => {
                if (data) {
                    this._initData()
                }
            })
    }

    _openSort = () => {
        this._sort = !this._sort
        this.forceUpdate()
    }

    _openEdit = (item) => {
        require('../../router/level3_router').showEditReply(2, item)
    }

    _sortUp = (item, index) => {

        //取出自己
        const vo1 = this._data.splice(index, 1)

        // //取出upitem
        const vo2 = this._data.splice(index - 1, 1)

        this._data.splice(index - 1, 0, vo1[0], vo2[0])

        let ids = []
        let sortingNo = []

        this._data.forEach((element) => {
            ids.push(element.id)
            sortingNo.push(element.sortingNo)
        })

        FastReplyModel.sortShortcutMessage(ids, sortingNo)
            .then(data => {

            })

        this.forceUpdate()

    }

    _sortDown = (item, index) => {


        // //取出upitem
        const vo2 = this._data.splice(index + 1, 1)

        //取出自己
        const vo1 = this._data.splice(index, 1)




        this._data.splice(index, 0, vo2[0], vo1[0])

        let ids = []
        let sortingNo = []

        this._data.forEach((element) => {
            ids.push(element.id)
            sortingNo.push(element.sortingNo)
        })

        FastReplyModel.sortShortcutMessage(ids, sortingNo)
            .then(data => {

            })

        this.forceUpdate()
    }

    _renderItem = ({ item, index }) => {
        return (
            <View
                style={{
                    width: DesignConvert.getW(345),
                }}
            >

                <View
                    style={{
                        marginTop: DesignConvert.getH(30),
                        marginBottom: DesignConvert.getH(20),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >

                    <Text
                        style={{
                            flex: 1,
                            color: '#333333',
                            fontSize: DesignConvert.getF(14),
                        }}
                    >

                        {item.message}
                    </Text>

                    {index === 0 ?
                        <View
                            style={{
                                width: DesignConvert.getW(17),
                                marginStart: DesignConvert.getW(26)
                            }}
                        />

                        :
                        <TouchableOpacity
                            style={{
                                display: this._sort ? 'flex' : 'none',
                                marginStart: DesignConvert.getW(26),
                            }}
                            onPress={() => {
                                this._sortUp(item, index)
                            }}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(17),
                                    height: DesignConvert.getH(13),
                                    resizeMode: 'contain',
                                }}
                                source={ic_sort_up()}
                            />
                        </TouchableOpacity>
                    }


                    {index == (this._data.length - 1) ?

                        <View
                            style={{
                                width: DesignConvert.getW(17),
                                marginStart: DesignConvert.getW(10),
                            }}
                        />

                        :

                        <TouchableOpacity
                            style={{
                                display: this._sort ? 'flex' : 'none',
                                marginStart: DesignConvert.getW(10),
                            }}
                            onPress={() => {
                                this._sortDown(item, index)
                            }}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(17),
                                    height: DesignConvert.getH(13),
                                    resizeMode: 'contain',
                                }}
                                source={ic_sort_down()}
                            />
                        </TouchableOpacity>
                    }



                </View>


                <View
                    style={{
                        display: this._sort ? 'none' : 'flex',
                        width: DesignConvert.getW(345),
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginBottom: DesignConvert.getH(10),
                    }}
                >


                    <TouchableOpacity
                        style={{
                            flexDirection: 'row'
                        }}
                        onPress={() => {
                            this._delte(item.id)
                        }}
                    >
                        <Image
                            source={ic_delete()}
                            style={{
                                width: DesignConvert.getW(13),
                                height: DesignConvert.getH(13),
                                resizeMode: 'contain',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        />


                        <Text
                            style={{
                                fontSize: DesignConvert.getF(12),
                                color: '#666666',
                                marginStart: DesignConvert.getW(5),
                            }}
                        >
                            {`删除`}
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            this._openEdit(item)
                        }}
                        style={{
                            flexDirection: 'row',
                            marginStart: DesignConvert.getW(20),
                        }}
                    >
                        <Image
                            source={ic_edit()}
                            style={{
                                width: DesignConvert.getW(13),
                                height: DesignConvert.getH(13),
                                resizeMode: 'contain',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        />


                        <Text
                            style={{
                                fontSize: DesignConvert.getF(12),
                                color: '#666666',
                                marginStart: DesignConvert.getW(5),
                            }}
                        >
                            {`编辑`}
                        </Text>

                    </TouchableOpacity>



                </View>


                <View
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(1),
                        backgroundColor: '#F0F0F0',
                    }}
                />
            </View>
        )
    }


    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                }}
            >

                <BackTitleView
                    titleText={'管理常用语'}
                    rightText={'排序'}
                    onRightPress={() => {
                        this._openSort()
                    }}
                    onBack={this.popSelf}
                    bgColor={['#CB5CFF', '#FF4D91']}
                    titleTextStyle={{
                        color: '#FFFFFF'
                    }}
                    rightTextStyle={{
                        color: '#FFFFFF'
                    }}
                    backImgStyle={{
                        tintColor: '#FFFFFF'
                    }}
                />

                <FlatList

                    style={{
                        flex: 1,
                    }}
                    data={this._data}
                    renderItem={this._renderItem}
                />

            </View>
        )
    }
}