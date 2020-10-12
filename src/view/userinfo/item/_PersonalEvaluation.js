
/**
 * 首页 -> 个人主页 ->标签列表
 */
'use strict';

import React, { PureComponent } from 'react';
import { Image, Text, TouchableOpacity, View, FlatList } from 'react-native';
import Config from '../../../configs/Config';
import { isAnnouncer } from '../../../model/main/AnnouncerModel';
import SoundUtil from '../../../model/media/SoundUtil';
import DesignConvert from '../../../utils/DesignConvert';
import { THEME_COLOR } from '../../../styles';

//评价item
class _evaluationTextItem extends PureComponent {


    render() {
        return (
            <View
                style={{
                    paddingHorizontal: DesignConvert.getW(10),
                    height: DesignConvert.getH(32),
                    borderColor: THEME_COLOR,
                    borderWidth: DesignConvert.getW(1),
                    borderRadius: DesignConvert.getW(15),
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: DesignConvert.getW(7.5),
                    marginVertical: DesignConvert.getH(5),
                }}>

                <Text
                    style={{
                        color: THEME_COLOR,
                        fontSize: DesignConvert.getF(12),
                    }}>
                    {`${this.props.item.labelName}${this.props.item.count}`}
                </Text>
            </View>
        )
    }
}


export default class _PersonalEvaluation extends PureComponent {

    constructor(props) {
        super(props)

        this._userId = this.props.userId;
        this._AnnouncerData = null;
        this._list = [];
    }

    async componentDidMount() {
        await this._initData();
    }

    _initData = async () => {
        //判断是否声优
        let res = await isAnnouncer(this._userId);
        if (res === undefined) {
            this.forceUpdate();
            return
        }
        this._isAnnouncer = res;
        if (this._isAnnouncer) {
            this._AnnouncerData = await require("../../../model/main/AnnouncerModel").default.getUserSkillInfo(this._userId)
        }
        this.forceUpdate();
    }

    _renderComprehensiveScore = () => {
        const avgScore = this._AnnouncerData ? this._AnnouncerData.avgScore : 0;
        let stars = [];
        const avgScoreInt = Math.round(avgScore);
        for (let index = 0; index < avgScoreInt; index++) {
            stars.push({ bHalf: false })
        }
        
        if (avgScoreInt == avgScore) {
        } else if (avgScoreInt > avgScore) {
            stars[stars.length - 1].bHalf = true;
        } else {
            stars.push({ bHalf: true })
        }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        color: '#333333',
                        fontSize: DesignConvert.getF(14)
                    }}
                >{'综合评分：'}</Text>
                {stars.map(item => (
                    <Image
                        source={item.bHalf ? require("../../../hardcode/skin_imgs/user_info").ic_stars_half() : require("../../../hardcode/skin_imgs/user_info").ic_stars()}
                        style={{
                            width: DesignConvert.getW(17),
                            height: DesignConvert.getH(16),
                            marginRight: DesignConvert.getW(3)
                        }}
                    />

                ))}
            </View>
        )
    }

    _renderItem = (item) => {
        return (
            <Text
                style={{
                    height: DesignConvert.getH(32),
                    minWidth: DesignConvert.getW(72),
                    borderRadius: DesignConvert.getW(18),
                    borderWidth: DesignConvert.getW(1),
                    borderColor: '#FF4D91',
                    color: '#FF4D91',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    marginRight: DesignConvert.getW(15),
                    marginBottom: DesignConvert.getH(10),
                    fontSize: DesignConvert.getF(12)
                }}
            >{item}</Text>
        )
    }


    render() {
        if (!this._isAnnouncer) {
            return null
        }
        const evaluationList = this._AnnouncerData ? this._AnnouncerData.labels : this._list
        const orderNum = this._AnnouncerData ? this._AnnouncerData.orderNum : 0;
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    marginTop: DesignConvert.getH(10)
                }}
            >
                <View
                    style={{
                        paddingHorizontal: DesignConvert.getW(20),
                        width: DesignConvert.swidth,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    {this._renderComprehensiveScore()}
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(14),
                            color: '#333333',
                            marginRight: DesignConvert.getW(24)
                        }}
                    >
                        {`总通话次数：${orderNum}`}
                    </Text>
                </View>

                <View
                    style={{
                        marginTop: DesignConvert.getH(13),
                        paddingHorizontal: DesignConvert.getW(12.5),
                        width: DesignConvert.swidth,
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}>
                    {evaluationList.map((element, i) => (
                        <_evaluationTextItem
                            item={element}
                        />
                    ))}
                </View>

                <View
                    style={{
                        marginTop: DesignConvert.getH(20),
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(1),
                        backgroundColor: '#D9D9D9'
                    }}
                />
            </View>
        )
    }
}