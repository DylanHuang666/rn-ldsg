'use strict';

import React, { PureComponent } from "react";
import { View, TouchableOpacity} from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
// import {BlurView} from 'react-native-blur';


//左滑View
export default class _RoomSliderView extends PureComponent {

    constructor(props) {
        super(props);
        this.props.onGetMe && this.props.onGetMe(this);
        this.state = {didMount: false, bgHeight: DesignConvert.sheight}
    }

    componentDidMount() {
        this._unMount = false;
        setTimeout(() => {
            this.setState({didMount: true})
        }, 100)
    }

    componentWillUnmount() {
        this._unMount = true;
    }

    setHeight(height) {
        if (this._unMount)
            return;
        this.setState({bgHeight: height})
    }


    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.showSliderView && this.props.showSliderView(false);
            }} activeOpacity={1.0} style={{flex: 1}}>
                {this.state.didMount ? <View
                                                 style={{
                                                     position: 'absolute',
                                                     left: DesignConvert.getW(65),
                                                     top: 0,
                                                     backgroundColor:"#00000055",
                                                     width: DesignConvert.swidth - DesignConvert.getW(65),
                                                     height: this.state.bgHeight,
                                                 }}/> : null}
                <View style={{
                    marginLeft: DesignConvert.getW(65),
                    paddingLeft: DesignConvert.getW(24),
                    paddingRight: DesignConvert.getW(16),
                    width: DesignConvert.swidth - DesignConvert.getW(65),
                    height: this.state.bgHeight,
                    backgroundColor: '#00000000'
                }}>

                </View>
            </TouchableOpacity>
        )
    }
}
