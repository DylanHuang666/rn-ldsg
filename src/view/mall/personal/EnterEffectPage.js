/**
 * 进场特效列表
 */

'use strict';

import React, { Component, PureComponent } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { getCarData } from "../../../cache/MallCache";
import Config from "../../../configs/Config";
import { COIN_NAME } from "../../../hardcode/HGLobal";
import { ic_triangle } from "../../../hardcode/skin_imgs/mall";
import { ic_diamond } from "../../../hardcode/skin_imgs/mywallet";
import { pressCar } from "../../../model/mall/MallModel";
import DesignConvert from "../../../utils/DesignConvert";
import ToastUtil from "../../base/ToastUtil";

const COL_COUNT = 3;


class _TopItem extends PureComponent {

    render() {

        const bActivity = this.props.info.hdata.gifttype == 2;

        const bOwn = !!this.props.info.goodsInfo;
        const remainTime = this.props.info.goodsInfo && this.props.info.goodsInfo.remainTime ? parseInt(this.props.info.goodsInfo.remainTime / 3600 / 24) : 0;

        if (bActivity) {
            return (
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#FF88EE', '#F85868']}
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(20),

                            borderTopLeftRadius: DesignConvert.getW(6),
                            borderBottomRightRadius: DesignConvert.getW(6),

                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: DesignConvert.getF(10),
                            }}
                        >活动获取</Text>
                    </LinearGradient>

                    {
                        //已拥有
                        bOwn ? (
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                colors={['#5B84F6', '#B567FF']}
                                style={{
                                    marginTop: DesignConvert.getH(3),
                                    width: DesignConvert.getW(50),
                                    height: DesignConvert.getH(20),

                                    borderTopLeftRadius: DesignConvert.getW(6),
                                    borderBottomRightRadius: DesignConvert.getW(6),

                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: DesignConvert.getF(10),
                                    }}
                                >{`剩余${remainTime}天`}</Text>
                            </LinearGradient>
                        ) : (
                                null
                            )
                    }
                </View>
            );
        }

        //已拥有
        if (bOwn) {
            return (
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#5B84F6', '#B567FF']}
                    style={{
                        position: 'absolute',
                        left: 0,

                        width: DesignConvert.getW(50),
                        height: DesignConvert.getH(20),

                        borderTopLeftRadius: DesignConvert.getW(6),
                        borderBottomRightRadius: DesignConvert.getW(6),

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: DesignConvert.getF(10),
                        }}
                    >{`剩余${remainTime}天`}</Text>
                </LinearGradient>
            );
        }

        let price;
        let day;
        if (this.props.info.hdata.onedayprice > 0) {
            price = this.props.info.hdata.onedayprice;
            day = 1;
        } else if (this.props.info.hdata.sevendayprice > 0) {
            price = this.props.info.hdata.sevendayprice;
            day = 7;
        } else {
            price = this.props.info.hdata.price;
            day = 30;
        }

        //价钱
        return (
            <View
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(8),
                    left: DesignConvert.getW(7),

                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(14),
                        height: DesignConvert.getH(13),
                    }}
                    source={ic_diamond()}
                />

                <Text
                    style={{
                        marginLeft: DesignConvert.getW(3),

                        color: '#333333',
                        fontSize: DesignConvert.getF(10),
                    }}
                >{`${price}${COIN_NAME}`}</Text>

                <Text
                    style={{
                        color: '#999999',
                        fontSize: DesignConvert.getF(10),
                    }}
                >{`/${day}天`}</Text>
            </View>
        );
    }
}


class _Item extends PureComponent {

    _onPress = () => {
        this.props.onPress(this.props.info);
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    marginLeft: DesignConvert.getW(6),
                    width: DesignConvert.getW(111),
                    height: DesignConvert.getH(158),

                    backgroundColor: '#F8F8F8',
                    borderRadius: DesignConvert.getW(6),

                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
                onPress={this._onPress}
            >

                <Image
                    style={{
                        marginTop: DesignConvert.getH(34),

                        width: DesignConvert.getW(85),
                        height: DesignConvert.getH(85),
                    }}
                    source={{ uri: Config.getCarUrl(this.props.info.hdata.carid, this.props.info.hdata.alterdatetime) }}
                />

                <Text
                    style={{
                        marginTop: DesignConvert.getH(12),

                        fontSize: DesignConvert.getF(12),
                        color: '#333333',
                    }}
                >{this.props.info.hdata.carname}</Text>

                {
                    this.props.selectedInfo == this.props.info ? (
                        <View
                            style={{
                                position: 'absolute',
                                width: DesignConvert.getW(111),
                                height: DesignConvert.getH(158),

                                borderRadius: DesignConvert.getW(6),
                                borderColor: '#FD7687',
                                borderWidth: DesignConvert.getW(1),
                            }}
                        />
                    ) : (
                            null
                        )
                }

                <_TopItem
                    info={this.props.info}
                />

            </TouchableOpacity>
        );
    }
}

class _BuyBottomItem extends Component {

    constructor(props) {
        super(props);

        // this._list = null;
        // this._selectedData = null;
        this._updateList(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.info == this.props.info) return false;

        this._updateList(nextProps);
        return true;
    }

    _updateList(props) {
        this._list = require('../../../model/mall/MallModel').getEnterRoomPriceChooseList(props.info.hdata);

        this._selectedData = this._list[0];
    }

    _onItemChoose = (vo) => {
        if (this._selectedData == vo) return;
        this._selectedData = vo;
        this.forceUpdate();
    }

    _onChoosePress = () => {
        if (!this._list) return;

        require("../../../router/level3_router").showHeadFrameBuyChooseView(
            this._list,
            this._onItemChoose
        )
    }

    _onBuy = () => {
        require('../../../model/mall/MallModel').buyEnterEffect(this.props.info.hdata.carid, this._selectedData.timeType)
            .then(bSuc => {
                if (bSuc) {
                    this.props.onUpdateInfo();
                    ToastUtil.showCenter("购买成功")
                }
            })
    }

    render() {
        //购买
        return (
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,

                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(45),

                    backgroundColor: 'white',
                }}
            >
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        top: DesignConvert.getH(7),
                    }}
                    onPress={this._onChoosePress}
                >
                    <View
                        style={{
                            width: DesignConvert.getW(130),
                            height: DesignConvert.getH(30),

                            borderWidth: DesignConvert.getW(1),
                            borderColor: '#F0F0F0',
                            borderRadius: DesignConvert.getW(17),

                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            style={{
                                marginLeft: DesignConvert.getW(21),

                                width: DesignConvert.getW(10),
                                height: DesignConvert.getH(9),
                            }}
                            source={ic_diamond()}
                        />

                        <Text
                            style={{
                                marginLeft: DesignConvert.getW(3),

                                color: '#333333',
                                fontSize: DesignConvert.getF(10),
                            }}
                        >{`${this._selectedData.money}${COIN_NAME}/${this._selectedData.day}天`}</Text>

                        <Image
                            style={{
                                position: 'absolute',
                                right: DesignConvert.getW(12),
                                top: DesignConvert.getH(11),

                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(8),
                            }}
                            source={ic_triangle()}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                    }}
                    onPress={this._onBuy}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#FF4D91', '#CB5CFF']}
                        style={{
                            width: DesignConvert.getW(75),
                            height: DesignConvert.getH(45),

                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: DesignConvert.getF(15),
                            }}
                        >购买</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}


export default class EnterEffectPage extends PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._updateInfo();
    }

    _updateInfo = () => {
        require("../../../model/mall/MallModel").getMyEnterEffectData()
            .then(datas => {
                this.forceUpdate();
            });
    }

    _onItemPress = (info) => {
        pressCar(info);

        this.forceUpdate();
    }

    _onActivityDetail = () => {
        //todo
        alert('todo:查看详情')
    }

    _renderRow(row) {
        const cache = getCarData();

        const ret = [];

        for (let c = 0; c < COL_COUNT; ++c) {
            const index = row * COL_COUNT + c;
            if (index >= cache.list.length) break;

            const info = cache.list[index];

            ret.push(
                <_Item
                    key={info.key}
                    info={info}
                    selectedInfo={cache.selectedInfo}
                    onPress={this._onItemPress}
                />
            );
        }

        return ret;
    }

    _renderRows() {
        const cache = getCarData();

        if (!cache || !cache.list) {
            return null;
        }

        const ret = [];

        const rowCount = Math.ceil(cache.list.length / COL_COUNT);
        for (let row = 0; row < rowCount; ++row) {
            ret.push(
                <View
                    key={row}
                    style={{
                        marginTop: DesignConvert.getH(6),
                        marginLeft: DesignConvert.getW(9),

                        flexDirection: 'row',
                    }}
                >
                    {this._renderRow(row)}
                </View>
            )
        }

        return ret;
    }

    _renderSelectBottom() {
        const cache = getCarData();

        if (!cache || !cache.selectedInfo) {
            return null;
        }

        const bActivity = cache.selectedInfo.hdata.gifttype == 2;

        //活动
        if (bActivity) {
            return (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 0,
                    }}
                    onPress={this._onActivityDetail}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#FF4D91', '#CB5CFF']}
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(45),

                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: DesignConvert.getF(15),
                            }}
                        >查看详情</Text>
                    </LinearGradient>
                </TouchableOpacity>

            )
        }

        //购买
        return (
            <_BuyBottomItem
                info={cache.selectedInfo}
                onUpdateInfo={this._updateInfo}
            />
        );
    }

    render() {

        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <ScrollView
                    style={{
                        flex: 1,
                    }}
                >
                    {this._renderRows()}


                </ScrollView>

                {this._renderSelectBottom()}
            </View>


        );
    }
}