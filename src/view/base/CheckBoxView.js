/**
 * checkbox
 */
'use strict'

import React, { PureComponent } from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default class CheckBoxView extends PureComponent {

    // constructor(props) {
    //     super(props);

    //     // this._bChecked = props.defaultValue === undefined || props.defaultValue == true;
    // }

    // _onPress = () => {
    //     this._bChecked = !this._bChecked;

    //     this.forceUpdate();
    // }

    render() {

        const DesignConvert = require('../../utils/DesignConvert').default;

        if (this.props.enable === false) {
            return (
                <Image
                    style={{
                        width: DesignConvert.getW(14),
                        height: DesignConvert.getH(14),
                    }}
                    source={require('../../hardcode/skin_imgs/checkbox').uncheck()}
                />
            );
        }

        return (
            <TouchableOpacity
                onPress={this.props.onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(14),
                        height: DesignConvert.getH(14),
                    }}
                    source={ this.props.bChecked
                        ? require('../../hardcode/skin_imgs/checkbox').check()
                        : require('../../hardcode/skin_imgs/checkbox').uncheck()
                    }
                />
            </TouchableOpacity>
        )

    }
}