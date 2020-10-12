/**
 * Created by mqc on 2020/06/23.
 */

'use strict';

import React, { PropTypes, PureComponent, } from 'react'
import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import DesignConvert from '../../utils/DesignConvert';

export default class ScrollTextView extends PureComponent {
    constructor(props) {
        super(props);

        this._interval = this.props.interval ? this.props.interval : 500;
        this._hadSetTimer = false;

        this._maxWidth = 0;
        this._textWidth = 0;
        this._scrollViewWidth = 0;

        this._scrollWidth = DesignConvert.getW(10);
        this.state = {
            currentX: 0,
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!this._hadSetTimer) {
            this._hadSetTimer = true;
            this._Timer = setTimeout(() => {
                if (!this._scrollView) {
                    this.setState({ currentX: this._scrollWidth, })
                } else {
                    console.log("---------------", this.state)
                    this._scrollView.scrollTo({
                        x: this.state.currentX,
                        y: 0,
                        animated: true
                    });

                    let currentIndex = this.state.currentX == this._maxWidth ? 0 :
                        this.state.currentX + this._scrollWidth > this._maxWidth ?
                            this._maxWidth :
                            this.state.currentX + this._scrollWidth;

                    this._hadSetTimer = false;
                    this.setState({ currentX: currentIndex, })
                }

            }, this._interval);
        }
        return true;
    }

    componentWillUnmount() {
        clearTimeout(this._Timer);
    }

    _getScrollView = (ref) => {
        this._scrollView = ref;
    }

    _getTextLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
        this._textWidth = width;
        this._setMaxWith();
    }

    _getScrollViewLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
        this._scrollViewWidth = width;
        this._setMaxWith();
    }

    _setMaxWith = () => {
        if(this._textWidth != 0 && this._scrollViewWidth != 0) {
            this._maxWidth = this._textWidth - this._scrollViewWidth
        }
        this.forceUpdate();
    }

    render() {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={this._getScrollView}
                scrollEnabled={false}
                onLayout={this._getScrollViewLayout}
                style={{
                    width: DesignConvert.getW(70),
                    height: DesignConvert.getH(14),

                    ...this.props.containStyle
                }}>
                <Text
                    style={{
                        color: "#212121",
                        fontSize: DesignConvert.getF(13),

                        ...this.props.textStyle
                    }}
                    onLayout={this._getTextLayout}>

                    {this.props.txt}
                </Text>
            </ScrollView>
        )
    }
}