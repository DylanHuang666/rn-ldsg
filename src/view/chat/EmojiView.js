
/**
 *  聊天 -> EmojiView
 */
'use strict';

import React, { PureComponent } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, } from "react-native";
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import DesignConvert from "../../utils/DesignConvert";

class EmojiPage extends PureComponent {
    constructor(props) {
        super(props);
        this._emojiList = this.props.emojiList;
        this._emojiAmountPerRow = this.props.emojiAmountPerRow;
    }

    _onEmojiPress = (s) => {
        this.props.callBack && this.props.callBack(s);
    }

    _renderRowView = (list) => {
        return(
            <View
                style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                
                {list.map((item, i) => {
                    if(!item) {
                        return(
                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(25),
                                    opacity: 0,
                                }}>
                                {"☀"}
                            </Text>
                        )
                    }else {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    this._onEmojiPress(item);
                                }}>
                                <Text
                                    style={{
                                        fontSize: DesignConvert.getF(25),
                                    }}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                })}
            </View>
        )
    }

    render() {
        let list1 = [];
        this._emojiList.forEach((element, i) => {
            if(i % this._emojiAmountPerRow == 0) {
                let list = this._emojiList.slice(i, i + this._emojiAmountPerRow);//截取每一行所需的emoji数组
                // console.log("EmojiView", "截取每一行所需的emoji数组" , list)
                if(list.length < this._emojiAmountPerRow) {
                    for(let j = list.length; j < this._emojiAmountPerRow; j++ ) {
                        list.push("");
                    }
                }
                list1.push(list);
            }
             
        })
        // console.log("EmojiView", "EmojiPage" , this._emojiList)
        return(
            <View
                style={[{
                    flex: 1,
                    margin: DesignConvert.getW(20),
                    marginTop: DesignConvert.getW(0),
                    justifyContent: "space-around",
                }, this.props.style]}>

                {list1.map((item, i) => (

                    this._renderRowView(item)
                ))}
            </View>
        )
    }
}

export default class EmojiView extends PureComponent {
    constructor(props) {
        super(props);

        this._emojiAmountPerPage = 28;
        this._emojiAmountPerRow = 7;
        this._emojiList = [
            "\uD83D\uDE25",
            "\uD83D\uDE0F",
            "\uD83D\uDE14",
            "\uD83D\uDE01",
            "\uD83D\uDE09",
            "\uD83D\uDE31",
            "\uD83D\uDE16",
            "\uD83D\uDE1A",
            "\uD83D\uDE1D",
            "\uD83D\uDE0C",
            "\uD83D\uDE28",
            "\uD83D\uDE37",
            "\uD83D\uDE33",
            "\uD83D\uDE12",
            "\uD83D\uDE30",
            "\uD83D\uDE32",
            "\uD83D\uDE2D",
            "\uD83D\uDE1C",
            "\uD83D\uDE18",
            "\uD83D\uDE21",
            "\uD83D\uDCAA",
            "\uD83D\uDC4A",
            "\uD83D\uDC4D",
            "☝",
            "\uD83D\uDC4F",
            "✌",
            "\uD83D\uDC4E",
            "\uD83D\uDE4F",
            "\uD83D\uDC4C",
            "\uD83D\uDC48",
            "\uD83D\uDC49",
            "\uD83D\uDC46",
            "\uD83D\uDC47",
            "\uD83D\uDC40",
            "\uD83D\uDC43",
            "\uD83D\uDC44",
            "\uD83D\uDC42",
            "\uD83C\uDF5A",
            "\uD83C\uDF5D",
            "\uD83C\uDF5C",
            "\uD83C\uDF59",
            "\uD83C\uDF67",
            "\uD83C\uDF63",
            "\uD83C\uDF82",
            "\uD83C\uDF5E",
            "\uD83C\uDF54",
            "\uD83C\uDF73",
            "\uD83C\uDF5F",
            "\uD83C\uDF7A",
            "\uD83C\uDF7B",
            "\uD83C\uDF78",
            "☕",
            "\uD83C\uDF4E",
            "\uD83C\uDF4A",
            "\uD83C\uDF53",
            "\uD83C\uDF49",
            "\uD83D\uDC8A",
            "\uD83D\uDEAC",
            "\uD83C\uDF84",
            "\uD83C\uDF39",
            "\uD83C\uDF89",
            "\uD83C\uDF34",
            "\uD83D\uDC9D",
            "\uD83C\uDF80",
            "\uD83C\uDF88",
            "\uD83D\uDC1A",
            "\uD83D\uDC8D",
            "\uD83D\uDCA3",
            "\uD83D\uDC51",
            "\uD83D\uDD14",
            "⭐",
            "✨",
            "\uD83D\uDCA8",
            "\uD83D\uDCA6",
            "\uD83D\uDD25",
            "\uD83C\uDFC6",
            "\uD83D\uDCB0",
            "\uD83D\uDCA4",
            "⚡",
            "\uD83D\uDC63",
            "\uD83D\uDCA9",
            "\uD83D\uDC89",
            "♨",
            "\uD83D\uDCEB",
            "\uD83D\uDD11",
            "\uD83D\uDD12",
            "✈",
            "\uD83D\uDE84",
            "\uD83D\uDE97",
            "\uD83D\uDEA4",
            "\uD83D\uDEB2",
            "\uD83D\uDC0E",
            "\uD83D\uDE80",
            "\uD83D\uDE8C",
            "⛵",
            "\uD83D\uDC69",
            "\uD83D\uDC68",
            "\uD83D\uDC67",
            "\uD83D\uDC66",
            "\uD83D\uDC35",
            "\uD83D\uDC19",
            "\uD83D\uDC37",
            "\uD83D\uDC80",
            "\uD83D\uDC24",
            "\uD83D\uDC28",
            "\uD83D\uDC2E",
            "\uD83D\uDC14",
            "\uD83D\uDC38",
            "\uD83D\uDC7B",
            "\uD83D\uDC1B",
            "\uD83D\uDC20",
            "\uD83D\uDC36",
            "\uD83D\uDC2F",
            "\uD83D\uDC7C",
            "\uD83D\uDC27",
            "\uD83D\uDC33",
            "\uD83D\uDC2D",
            "\uD83D\uDC52",
            "\uD83D\uDC57",
            "\uD83D\uDC84",
            "\uD83D\uDC60",
            "\uD83D\uDC62",
            "\uD83C\uDF02",
            "\uD83D\uDC5C",
            "\uD83D\uDC59",
            "\uD83D\uDC55",
            "\uD83D\uDC5F",
            "☁",
            "☀",
            "☔",
            "\uD83C\uDF19",
            "⛄",
            "⭕",
            "❌",
            "❔",
            "❕",
            "☎",
            "\uD83D\uDCF7",
            "\uD83D\uDCF1",
            "\uD83D\uDCE0",
            "\uD83D\uDCBB",
            "\uD83C\uDFA5",
            "\uD83C\uDFA4",
            "\uD83D\uDD2B",
            "\uD83D\uDCBF",
            "\uD83D\uDC93",
            "♣",
            "\uD83C\uDC04",
            "〽",
            "\uD83C\uDFB0",
            "\uD83D\uDEA5",
            "\uD83D\uDEA7",
            "\uD83C\uDFB8",
            "\uD83D\uDC88",
            "\uD83D\uDEC0",
            "\uD83D\uDEBD",
            "\uD83C\uDFE0",
            "⛪",
            "\uD83C\uDFE6",
            "\uD83C\uDFE5",
            "\uD83C\uDFE8",
            "\uD83C\uDFE7",
            "\uD83C\uDFEA",
            "\uD83D\uDEB9",
            "\uD83D\uDEBA"
        ]
    }
    
    render() {
        let emojiList = [];
        this._emojiList.forEach((element, i) => {
            if(i % this._emojiAmountPerPage == 0) {
                let list = this._emojiList.slice(i, i + this._emojiAmountPerPage);//截取每一页所需的emoji数组
                emojiList.push(list);
            }
        })
        // console.log("EmojiView", "emojiList" , emojiList)
        return(
            <ViewPager
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(300),
                    
                    ...this.props.containerStyle
                }}>
                
                {emojiList.map((item, i) => (
                    <View>
                        <EmojiPage 
                            emojiList={item}
                            emojiAmountPerRow={this._emojiAmountPerRow}
                            callBack={this.props.callBack}/>
                    </View>
                ))}
            </ViewPager>
        )
    }
}