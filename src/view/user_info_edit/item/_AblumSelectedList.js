/**
 * 相册选择列表
 */

'use strict';

import React, { PureComponent } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TextInput, TouchableOpacity, ImageBackground, FlatList } from "react-native";
import DesignConvert from '../../../utils/DesignConvert';
import Config from '../../../configs/Config';
import { ic_photo_add, ic_photo_delete } from '../../../hardcode/skin_imgs/user_info';
import { MAX_ABLUM } from '../../../hardcode/HGLobal';

class _PhotoEditItem extends PureComponent {
    _onItemPress = () => {
        this.props.onItemPress && this.props.onItemPress(this.props.item);
    }

    _onDeletePress = () => {
        this.props.onDeletePress && this.props.onDeletePress(this.props.item);
    }

    _onAddPress = () => {
        this.props.onAddPress && this.props.onAddPress();
    }

    render() {
        // const img = Config.getUserBannerUrl()

        if (this.props.bAdd) {
            return (
                <TouchableOpacity
                    onPress={this._onAddPress}
                    style={{
                        marginBottom: DesignConvert.getH(5),
                        marginHorizontal: DesignConvert.getW(3),
                    }}>
                    <Image
                        source={ic_photo_add()}
                        style={{
                            width: DesignConvert.getW(82),
                            height: DesignConvert.getH(82),
                        }}>
                    </Image>
                </TouchableOpacity>
            )
        }
        return (
            <ImageBackground
                source={{ uri: this.props.item.uri }}
                style={{
                    width: DesignConvert.getW(82),
                    height: DesignConvert.getH(82),
                    marginBottom: DesignConvert.getH(5),
                    marginHorizontal: DesignConvert.getW(3),
                }}>

                <TouchableOpacity
                    onPress={this._onDeletePress}
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                    }}>

                    <Image
                        source={ic_photo_delete()}
                        style={{
                            width: DesignConvert.getW(18),
                            height: DesignConvert.getH(18),
                        }}></Image>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

export default class _AblumSelectedList extends PureComponent {

    _onItemPress = (item) => {
        this.props.onItemPress && this.props.onItemPress(item);
    }

    _onDeletePress = (item) => {
        this.props.onDeletePress && this.props.onDeletePress(item);
    }

    _onAddPress = () => {
        const list = this.props.data;
        if (list[list.length - 1].bAdd) {
            list.pop();
        }
        this.props.onAddPress && this.props.onAddPress();
    }

    _renderItem = ({ item }) => {
        return (
            <_PhotoEditItem
                bAdd={item.bAdd}
                item={item}
                onItemPress={this._onItemPress}
                onDeletePress={this._onDeletePress}
                onAddPress={this._onAddPress}
            />
        )
    }

    render() {
        const list = this.props.data;
        if (list.length == 0 || (list.length < MAX_ABLUM && !list[list.length - 1].bAdd)) {
            list.push({ bAdd: true });
        }

        return (
            <FlatList
                numColumns={4}
                data={list}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                style={{
                    marginTop: DesignConvert.getH(10),
                    width: DesignConvert.getW(352),
                    alignSelf: "center",
                }}
            />
        )
    }
}