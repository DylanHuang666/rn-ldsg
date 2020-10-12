/**
 * 竖向文本的组件
 */

'use strict';

import React, { PureComponent } from "react";
import { Text, View } from "react-native";

// {/* <VerticalText
//     containerStyle={???}                            //容器View的样式
//     txt={'内容内容。。。'}                           //内容
//     txtColor={'#FFFFFF'}                            //文本颜色
//     txtFontSize={DesignConvert.getF(15)}            //字体大小
//     txtSpace={DesignConvert.getH(5)}                //间距
// /> */}

export default class VerticalText extends PureComponent {

    render() {

        if (!this.props.txt) return null;

        const a = [
            (
                <Text
                    key={0}
                    style={{
                        color: this.props.txtColor,
                        fontSize: this.props.txtFontSize,
                    }}
                >{this.props.txt.charAt(0)}</Text>
            )
        ];
        for (let i = 1; i < this.props.txt.length; ++i) {
            a.push(
                <Text
                    key={i}
                    style={{
                        marginTop: this.props.txtSpace,
                        color: this.props.txtColor,
                        fontSize: this.props.txtFontSize,
                    }}
                >{this.props.txt.charAt(i)}</Text>
            );
        }

        return (
            <View
                style={this.props.containerStyle}
            >
                {a}
            </View>
        )
    }
}
