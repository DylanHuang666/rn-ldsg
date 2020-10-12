'use strict';

import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import { mine_rich_lv, mine_charm_lv } from '../../hardcode/skin_imgs/main';

/**
 * 勋章
 */
export default class MedalWidget extends PureComponent {

    constructor(props) {
        super(props)

        // this.props.richLv = this.props.richLv
        // this.props.charmLv = this.props.charmLv

        this._width = this.props.width ? this.props.width : DesignConvert.getW(40)
        this._height = this.props.height ? this.props.height : DesignConvert.getH(18)

        // if (!this.props.richLv) {
        //     this.props.richLv = 1
        // }

        // if (!this.props.charmLv) {
        //     this.props.charmLv = 1
        // }

    }


    render() {

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    ...this.props.containerStyle
                }}
            >

                {this.props.richLv && this.props.richLv > 0 &&
                    <Image
                        style={{
                            width: this._width,
                            height: this._height,
                            resizeMode: 'contain',
                            marginEnd: DesignConvert.getW(5),
                        }}
                        source={mine_rich_lv(this.props.richLv)}
                    />}

                {this.props.charmLv && this.props.charmLv > 0 &&
                    <Image
                        style={{
                            width: this._width,
                            height: this._height,
                            resizeMode: 'contain',
                            marginEnd: DesignConvert.getW(5),
                        }}
                        source={mine_charm_lv(this.props.charmLv)}
                    />}

            </View>
        )
    }
}