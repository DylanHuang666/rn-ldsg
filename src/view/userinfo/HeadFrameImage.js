'use strict';

import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';
import Config from '../../configs/Config';
import DesignConvert from '../../utils/DesignConvert';
import { HEAD_DECORATOR_SCALE } from '../../hardcode/HGLobal';


// id={头像框id} 
// width={头像宽}
// height={头像高}
export default class HeadFrameImage extends PureComponent {

    constructor(props) {
        super(props)


    }

    render() {
        if (!this.props.id) {
            return null
        }

        const headFrameUri = { uri: Config.getShopHeadFrameIdUrl(this.props.id) };

        return (
            <Image
                style={{
                    position: 'absolute',
                    width: DesignConvert.getW(this.props.width * HEAD_DECORATOR_SCALE),
                    height: DesignConvert.getH(this.props.height * HEAD_DECORATOR_SCALE)
                }}
                resizeMode='stretch'
                source={headFrameUri}
            />
        )
    }
}