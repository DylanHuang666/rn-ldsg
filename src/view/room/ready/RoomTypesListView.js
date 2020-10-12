/**
 * 开播设置 -> 房间类型
 */
'use strict';

import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../../utils/DesignConvert';



class RoomTypeItem extends PureComponent {

    _onPress = () => {
        this.props.onPress(this.props.index, this.props.data);
    }

    render() {
        if (this.props.selected) {
            return (
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#FF5245', '#CD0031']}
                    style={{
                        marginTop: DesignConvert.getH(10),
                        marginHorizontal: DesignConvert.getW(8),

                        width: DesignConvert.getW(37),
                        height: DesignConvert.getH(21),
                        borderRadius: DesignConvert.getW(11),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: DesignConvert.getF(12),
                        }}
                    >{this.props.data.type}</Text>
                </LinearGradient>
            );
        }

        return (
            <TouchableOpacity
                style={{
                    marginTop: DesignConvert.getH(10),
                    marginHorizontal: DesignConvert.getW(8),
                }}
                onPress={this._onPress}
            >
                <View
                    style={{
                        width: DesignConvert.getW(37),
                        height: DesignConvert.getH(21),
                        borderRadius: DesignConvert.getW(11),

                        backgroundColor: '#787878',

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: DesignConvert.getF(12),
                        }}
                    >{this.props.data.type}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}


const ROOM_TYPE_COL_COUNT = 4;

export default class RoomTypesListView extends PureComponent {

    _onPress = (index, data) => {
        this.props.onChangeRoomType(index, data);
    }

    _renderItems() {
        if (!this.props.datas || this.props.datas.length == 0) {
            return null;
        }

        const ret = [];

        for (let i = 0; i < this.props.datas.length; ++i) {
            ret.push(
                <RoomTypeItem
                    key={i}
                    selected={this.props.selectedIndex == i}
                    index={i}
                    data={this.props.datas[i]}
                    onPress={this._onPress}
                />
            );
        }
        return ret;
    }

    _renderRow(rowIndex) {
        const ret = [];

        for (let i = 0; i < ROOM_TYPE_COL_COUNT; ++i) {
            const index = rowIndex * ROOM_TYPE_COL_COUNT + i;
            const info = this.props.datas[index];
            if (!info) break;

            ret.push(
                <RoomTypeItem
                    key={index}
                    selected={this.props.selectedIndex == index}
                    index={index}
                    data={info}
                    onPress={this._onPress}
                />
            );
        }
        return ret;
    }

    render() {
        if (!this.props.datas || this.props.datas.length == 0) {
            return null;
        }

        const ret = [];

        const rowCount = Math.ceil(this.props.datas.length / ROOM_TYPE_COL_COUNT);

        for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
            ret.push(
                <View
                    key={rowIndex}
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    {this._renderRow(rowIndex)}
                </View>
            );
        }

        return ret;
    }
}