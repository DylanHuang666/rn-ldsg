/**
 * Tab
 */


'use strict';

import React, { PureComponent } from 'react';
import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';
import { THEME_COLOR } from '../../../styles';

const TabItem = props => {
    const { isSelected, index, title, onPress } = props;

    let txt
    switch (title) {
        case 1:
            txt = "礼物流水"
            break;
        case 2:
            txt = "提现记录"

            break;
        case 3:
            txt = "兑换记录"

            break;
        case 4:
            txt = "直播间流水"

            break;
        case 5:
            txt = "转赠记录"

            break;
        case 6:
            txt = "充值记录"
        case 7:
            txt = "受赠记录"
            break;
    }

    const itemClick = () => {
        onPress(title, index);
    }

    return (
        <TouchableOpacity
            style={{
                minWidth: DesignConvert.getW(26),
                height: DesignConvert.getH(44),
                marginHorizontal: DesignConvert.getW(15),
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={itemClick}
        >
            <Text
                style={{
                    color: isSelected ? THEME_COLOR : '#CCCCCC',
                    fontSize: isSelected ? DesignConvert.getF(14) : DesignConvert.getF(14),
                    // fontWeight: isSelected ? "bold" : "normal",
                }}
            >{txt}</Text>

            {isSelected ? (
                <View
                    style={{
                        width: DesignConvert.getW(12),
                        height: DesignConvert.getH(5),

                        borderRadius: DesignConvert.getW(2),
                        backgroundColor: THEME_COLOR,

                        position: "absolute",
                        bottom: 0
                    }}>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

const TabItem2 = props => {
    const { isSelected, index, title, onPress, isHied } = props;

    let txt
    switch (title) {
        case 1:
            txt = "礼物流水"
            break;
        case 2:
            txt = "提现记录"

            break;
        case 3:
            txt = "兑换记录"

            break;
        case 4:
            txt = "直播间流水"

            break;
        case 5:
            txt = "转赠记录"

            break;
        case 6:
            txt = "充值记录"
            break;

        case 7:
            txt = "受赠记录"
            break;
    }

    const itemClick = () => {
        onPress(title, index);
    }

    return (
        <TouchableOpacity
            style={{
                minWidth: DesignConvert.getW(86),
                height: DesignConvert.getH(34),

                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={itemClick}
        >
            <Text
                style={{
                    color: isSelected ? '#D02AFF' : 'rgba(208, 42, 255,0.4)',
                    fontSize: isSelected ? DesignConvert.getF(12) : DesignConvert.getF(12),
                    fontWeight: isSelected ? "bold" : "bold",
                }}
            >{txt}</Text>

            {!isHied && (
                <View
                    style={{
                        width: DesignConvert.getW(1),
                        height: DesignConvert.getH(10),

                        backgroundColor: 'rgba(208, 42, 255,0.4)',

                        position: "absolute",
                        right: 0
                    }}>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default class _SelectTab extends PureComponent {
    constructor(props) {
        super(props);

        this.defaultSelected = props.defaultSelected;
        this.items = props.items;
        this.itemClick = props.itemClick;
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.defaultSelected = nextProps.defaultSelected;
        this.items = nextProps.items;
        return true;
    }

    _scrollToItem = () => {
        this._scrollView && this._scrollView.scrollTo({ x: this.defaultSelected * DesignConvert.getW(41), y: 0, animated: false })
    }
    render() {
        this._scrollToItem();
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(44),

                    ...this.props.style
                }}>
                <ScrollView
                    ref={ref => {
                        this._scrollView = ref;
                    }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        height: DesignConvert.getH(44),
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        // paddingLeft: DesignConvert.getW(10),
                    }}>
                    {this.items.map((item, i) => (
                        <TabItem
                            key={i}
                            index={i}
                            title={item}
                            isSelected={this.defaultSelected == i}
                            onPress={this.itemClick} />
                    ))}

                </ScrollView>
            </View>
        )
    }
}

export class _SelectTab2 extends PureComponent {
    constructor(props) {
        super(props);

        this.defaultSelected = props.defaultSelected;
        this.items = props.items;

        this.itemClick = props.itemClick;
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.defaultSelected = nextProps.defaultSelected;
        this.items = nextProps.items;
        return true;
    }

    _scrollToItem = () => {
        this._scrollView && this._scrollView.scrollTo({ x: this.defaultSelected * DesignConvert.getW(41), y: 0, animated: false })
    }
    render() {

        return (
            <View
                style={{
                    // width: DesignConvert.getW(260),
                    height: DesignConvert.getH(34),
                    borderRadius: DesignConvert.getW(20),
                    alignSelf: 'center',

                    borderWidth: DesignConvert.getW(1),
                    backgroundColor: '#F9E2FF',
                    borderColor: '#5F1271',

                    flexDirection: 'row',
                    justifyContent: 'center',


                    ...this.props.style
                }}>

                {this.items.map((item, i) => (
                    <TabItem2
                        key={i}
                        index={i}
                        title={item}
                        isSelected={this.defaultSelected == i}
                        onPress={this.itemClick}
                        isHied={i === (this.items.length - 1)}
                    />
                ))}

            </View>
        )
    }
}