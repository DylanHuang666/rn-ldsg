/**
 * 主界面 -> 首页 -> 在线房间列表
 */
'use strict';

import moment from 'moment';
import React, { PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
// import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
// import LinearGradient from 'react-native-linear-gradient';
// import HClientTables from '../../../hardcode/HClientTables';
import DesignConvert from '../../../utils/DesignConvert';
import ModelEvent from '../../../utils/ModelEvent';
import { EVT_UPDATE_ROOM_TABS_POSITION } from '../../../hardcode/HGlobalEvent';

// const TabItem = props => {
//     const { isSelected, index, title, onPress, fontColor } = props;

//     const itemClick = () => {
//         onPress(title, index);
//     }

//     const

//         ModelEvent.addEvent(null, EVT_UPDATE_ROOM_OTHER_MIC, this._onCacheUpdate)
//     ModelEvent.addEvent(null, EVT_UPDATE_ROOM_TABS_POSITION,)
//     return (

//     );
// };

export default class RoomTabs extends React.Component {
    constructor(props) {
        super(props);

        this.defaultSelected = props.defaultSelected;
        this.items = props.items;
        this.itemClick = props.itemClick;
        this._tabsOffsetXGorup = [];
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_TABS_POSITION, this._scorllTo)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_TABS_POSITION, this._scorllTo)
    }

    _scorllTo = i => {
        const offsetX = this._tabsOffsetXGorup[i]
        this._scrollView.scrollTo({ x: offsetX, y: 0, animated: true }, 1)
    }

    _pushItemOffsetX = (e, i) => {
        this._tabsOffsetXGorup.push(e.nativeEvent.layout.x)
        if (i === this.items.length - 1) {
            this._tabsOffsetXGorup.sort((a, b) => {
                return a - b
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.defaultSelected = nextProps.defaultSelected;
        this.items = nextProps.items;
        this.itemClick = nextProps.itemClick;
        return true;
    }

    _getScrollRef = ref => {
        this._scrollView = ref
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(31),
                    marginLeft: DesignConvert.getW(24),
                    marginTop: DesignConvert.getH(15),
                }}
            >
                <ScrollView
                    ref={this._getScrollRef}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >

                    {this.items.map((item, i) => (
                        <TouchableOpacity
                            onLayout={(e) => this._pushItemOffsetX(e, i)}
                            key={i}
                            style={{
                                marginRight: DesignConvert.getW(40),
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                this.itemClick(item, i)
                            }}
                        >
                            <Text
                                style={{
                                    color: this.defaultSelected == i ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                                    fontSize: this.defaultSelected == i ? DesignConvert.getF(15) : DesignConvert.getF(15),
                                    fontWeight: this.defaultSelected == i ? "bold" : "normal",
                                }}
                            >{item.type}</Text>

                            {/* {this.defaultSelected == i ? (
                                <Image
                                    source={require('../../../hardcode/skin_imgs/yuanqi').tab_sel()}
                                    style={{
                                        width: DesignConvert.getW(13),
                                        height: DesignConvert.getH(7),
                                        marginTop: DesignConvert.getH(3),
                                        resizeMode: 'contain',
                                    }}
                                />
                            ) : null} */}

                        </TouchableOpacity>
                    ))}

                </ScrollView>
            </View>
        )
    }
}
