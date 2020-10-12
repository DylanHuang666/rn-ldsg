/*
 * @Author: your name
 * @Date: 2020-09-15 19:06:12
 * @LastEditTime: 2020-09-23 11:05:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /XStudio/TTT/src/view/main/home/item/OficialRecommendRoom.js
 */
/*
 * @Author: your name
 * @Date: 2020-09-15 19:06:12
 * @LastEditTime: 2020-09-15 22:22:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /XStudio/TTT/src/view/main/home/item/OficialRecommendRoom.js
 */
/**
 * 主界面 -> 首页 -> 搜索
 */
'use strict';
import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, ScrollView } from 'react-native';
// import DesignConvert from '../../../../utils/DesignConvert';
import DesignConvert from '../../../../utils/DesignConvert';
import _RoomRecommendItem from './_RoomRecommendItem';


export default function OficialRecommendRoom(props) {

    const { data, roomTypeList } = props

    const _getRoomType = (roomType) => {
        let roomTypeName = "其他";
        roomTypeList.forEach(element => {
            if (roomType == element.id) {
                roomTypeName = element.type;
            }
        });
        return roomTypeName;
    }


    const _renderItem = ({ item, index }) => {
        return (
            <_RoomRecommendItem
                item={item}
                index={index}
                getRoomType={_getRoomType}
            />

        )
    }

    const _renderPrefixItem = ({ item, index }) => {
        return (
            <View>
                {
                    index < 15 ? <_RoomRecommendItem
                        item={item}
                        index={index}
                        getRoomType={_getRoomType}
                    /> : null
                }
            </View>

        )
    }

    const _renderSuffixItem = ({ item, index }) => {
        return (
            <View>
                { index < 15 ? null :
                    <_RoomRecommendItem
                        item={item}
                        index={index}
                        getRoomType={_getRoomType}
                    />
                }
            </View>

        )

        return (
            <_RoomRecommendItem
                item={item}
                index={index}
                getRoomType={_getRoomType}
            />

        )
    }

    const _renderFlatHeader = () => {

        return (
            <View
                style={{
                    height: DesignConvert.getH(28),
                    marginHorizontal: DesignConvert.getW(10),
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: DesignConvert.getF(15),
                    }}
                >{'优质推荐'}</Text>
            </View>

        )
    }
    console.warn(data)
    return (
        <View
            style={{
                flex: 1
            }}
        >
            <Text
                style={{
                    color: 'white',
                    fontSize: DesignConvert.getF(14),
                    height: DesignConvert.getH(28),
                    marginTop: DesignConvert.getH(15),
                    marginHorizontal: DesignConvert.getW(10),
                    justifyContent: 'center'
                }}
            >{'推荐房间'}</Text>
            <FlatList
                data={data}
                renderItem={_renderPrefixItem}
                onEndReachedThreshold={0.2}
                contentContainerStyle={{

                    // paddingHorizontal: DesignConvert.getW(15),
                    marginTop: DesignConvert.getH(15),
                    // height: DesignConvert.getH(300),
                }}
                // initialNumToRender={2}
                horizontal={true}
            />
            {data.length > 15 ?
                <FlatList
                    data={data}
                    renderItem={_renderSuffixItem}
                    onEndReachedThreshold={0.2}
                    contentContainerStyle={{
                        // paddingHorizontal: DesignConvert.getW(15),
                        marginTop: DesignConvert.getH(15),
                    }}
                    initialNumToRender={2}
                    horizontal={true}
                />
                : <View />}
        </View>

    )

}