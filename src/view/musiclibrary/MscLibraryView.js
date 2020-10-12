
/**
 * 聊天室 -> 音乐库
 */
'use strict';

import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, ScrollView, ActivityIndicator, Slider } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../utils/DesignConvert';
import Config from '../../configs/Config';
import BackTitleView from '../base/BackTitleView';
import StatusBarView from "../base/StatusBarView";
import BaseView from '../base/BaseView';
import { ic_back_black } from "../../hardcode/skin_imgs/common";
import ToastUtil from "../base/ToastUtil";

const [localMedia, HotMedia] = [125, 258]
class MusicLibraryPage extends PureComponent {
    constructor(props) {
        super(props);

        if(this.props.type == localMedia) {
            this._list = [{type: 1}, {type: 1}, {type: 1}, {type: 1}, {type: 1}, {type: 1}, {type: 1}]
        }else {
            this._list = [{type: -1}, {type: -1}, {type: 0}, {type: 0}, {type: -1}, {type: -1}, {type: -1}]
        }
    }

    _renderItem = ({item}) => {
        return(
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(41),
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: DesignConvert.getW(30),
                    paddingRight: DesignConvert.getW(30),
                }}>
                
                <Text
                    numberOfLines={1}
                    style={{
                        color: "#1A1A1A",
                        fontSize: DesignConvert.getF(16),
                        flex: 1,
                    }}>只想一生跟你走</Text>

                <TouchableOpacity
                    onPress={() => {
                        //TODO:
                    }}>
                    <Image
                        source={require("../../hardcode/skin_imgs/music_library").ic_delete()}
                        style={{
                            width: DesignConvert.getW(13),
                            height: DesignConvert.getH(16),
                            display: item.type==1? "flex": "none",
                        }}></Image>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={() => {
                        //TODO:
                    }}>
                    <Image
                        source={require("../../hardcode/skin_imgs/music_library").ic_complete()}
                        style={{
                            width: DesignConvert.getW(14),
                            height: DesignConvert.getH(9.33),
                            display: item.type==-1? "flex": "none",
                        }}></Image>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={() => {
                        //TODO:
                        item.type = 2;
                        this.forceUpdate();
                    }}>
                    <Image
                        source={require("../../hardcode/skin_imgs/music_library").ic_download()}
                        style={{
                            width: DesignConvert.getW(14),
                            height: DesignConvert.getH(12),
                            display: item.type==0? "flex": "none",
                        }}></Image>
                </TouchableOpacity>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getBorderWidth(1),
                        backgroundColor: "#F5F5F5",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                    }}></View>
            </View>
        )
    }

    render() {
        return (
            <FlatList
                data={this._list}
                renderItem={this._renderItem}
                ></FlatList>
        )
    }
}

class MediaPlayer extends PureComponent {
    constructor(props) {
        super(props);

        this._isPaly = false;
        this._value = 50;
    }

    _onPlayPress = () => {
        this._isPaly = !this._isPaly;
        this.forceUpdate();
    }

    _onVolumeChange = (s) => {
        // console.log("Sliding", s);
    }

    render() {
        return(
            <View>
                <LinearGradient
                    angle={180}
                    colors={["rgba(255, 255, 255, 0)", "rgba(245, 245, 245, 1)"]}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(20),
                    }}></LinearGradient>
                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(66),
                        flexDirection: "row",
                    }}>

                    <Image
                        source={require("../../hardcode/skin_imgs/music_library").ic_song_disc()}
                        style={{
                            width: DesignConvert.getW(40),
                            height: DesignConvert.getH(40),
                            position: "absolute",
                            left: DesignConvert.getW(20),
                            top: DesignConvert.getH(15),
                        }}></Image>

                    <Text
                        style={{
                            color: "#1A1A1A",
                            fontSize: DesignConvert.getF(13),
                            position: "absolute",
                            left: DesignConvert.getW(68),
                            top: DesignConvert.getH(18),
                        }}>{this.props.songName}</Text>

                    <Image
                        source={require("../../hardcode/skin_imgs/music_library").ic_volume()}
                        style={{
                            width: DesignConvert.getW(12),
                            height: DesignConvert.getH(11),
                            position: "absolute",
                            left: DesignConvert.getW(68),
                            top: DesignConvert.getH(37),
                        }}></Image>

                    <Slider
                        thumbImage={require("../../hardcode/skin_imgs/music_library").ic_thumb()}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={this._value}
                        minimumTrackTintColor="#FA495F"
                        maximumTrackTintColor="#FEDBDF"
                        thumbTintColor="#FA495F"
                        onValueChange={this._onVolumeChange}
                        style={{
                            width: DesignConvert.getW(150),
                            position: "absolute",
                            left: DesignConvert.getW(86),
                            top: DesignConvert.getH(33),
                        }}></Slider>

                    <TouchableOpacity
                        onPress={this._onPlayPress}
                        style={{
                            width: DesignConvert.getW(26),
                            height: DesignConvert.getH(26),
                            position: "absolute",
                            right: DesignConvert.getW(20),
                            top: DesignConvert.getH(20),
                            backgroundColor: "#FA495F",
                            borderRadius: DesignConvert.getW(26),
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Image
                            source={this._isPaly? require("../../hardcode/skin_imgs/music_library").ic_pause() :require("../../hardcode/skin_imgs/music_library").ic_play()}
                            style={{
                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(13),
                            }}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default class MscLibraryView extends BaseView {
    constructor(props) {
        super(props);

        this._tabLayoutOffset = 0;
        this._selectTab = 0;
    }

    _onBackPress = () => { 
        this.popSelf();
    }

    _onPageChange = e => {
        this._selectTab = e.position;
        this._tabLayoutOffset = e.offset;
        this.forceUpdate();
    }

    _renderTabLayout() {
        return(
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(44),
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 0;
                        this.forceUpdate();
                        this._viewPager.setPage(0);
                    }}
                >
                    <Text
                        style={{
                            color: this._selectTab==0?"#333333":"#808080",
                            fontSize: DesignConvert.getF(15),
                            fontWeight: this._selectTab==0?"bold":"normal",
                            marginLeft: DesignConvert.getW(91.33),
                        }}
                    >我的曲库</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 1;
                        this.forceUpdate();
                        this._viewPager.setPage(1);
                    }}
                >
                    <Text
                        style={{
                            color: this._selectTab==1?"#333333":"#808080",
                            fontSize: DesignConvert.getF(15),
                            fontWeight: this._selectTab==1?"bold":"normal",
                            marginLeft: DesignConvert.getW(43.67),
                        }}
                    >热门推荐</Text>
                </TouchableOpacity>
                
                <View
                    style={{
                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(4),
                        borderRadius: DesignConvert.getW(2),
                        position: "absolute",
                        backgroundColor: "#F63B6D",
                        bottom: 0,
                        left: DesignConvert.getW(this._selectTab==0?110.6:220),
                    }}
                ></View>
            </View>
        )
    }

    render() {
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                }}>
                <StatusBarView/>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(44),

                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >

                    {this._renderTabLayout()}

                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            left: DesignConvert.getW(20),
                            top: DesignConvert.getH(12),
                        }}
                        onPress={this._onBackPress}
                    >
                        <Image
                            style={{
                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(21),
                            }}
                            source={ic_back_black()}
                        />
                    </TouchableOpacity>
                </View>

                <ViewPager
                    initialPage={this._selectTab}
                    style={{flex:1, }}
                    onPageSelected={this._onPageChange}
                    scrollEnabled={false}
                    ref={(ref) => {
                        this._viewPager = ref;
                    }}
                >

                    <View 
                        style={{
                            flex: 1,
                        }}
                    >
                        <MusicLibraryPage
                            type={localMedia} />
                    </View>

                    <View 
                        style={{
                            flex: 1,
                        }}
                    >
                        <MusicLibraryPage
                            type={HotMedia} />
                    </View>
                </ViewPager>

                <MediaPlayer
                    songName="My Love"></MediaPlayer>
            </View>
        )
    }
}