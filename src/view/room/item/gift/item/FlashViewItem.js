/**
 * flashView全屏显示
 */
'use strict';

import React, { PureComponent } from 'react';
import Config from '../../../../../configs/Config';
import DesignConvert from '../../../../../utils/DesignConvert';
import FlashView from '../../../../base/FlashView';


export default class FlashViewItem extends PureComponent {

    constructor(props) {
        super(props);
        this._extraData = 0;
    }

    render() {
        const animName = this.props.vo.animName


        const url = Config.getTreasureBoxAnimationUrl(animName, this.props.vo.boxData.updatedate.toDateTimeTick())


        const replaceTexFileName = this.props.vo.replaceTexFileName

        let replaceTexture
        if (this.props.vo) {
            replaceTexture = [{
                anim: animName,
                from: 0,
                to: -1,
                // to: ((i + 1) < fil ? info.frameIndex[i + 1] - 2 : -1),
                oldTex: 'brick.png',
                newTex: replaceTexFileName,
            }]
        }
        return (
            <FlashView
                style={{
                    position: 'absolute',
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                }}
                url={url}
                flashFileName={animName}
                // stopWith={-1}
                // fromIndex={0}
                // toIndex={100}
                replaceTexture={replaceTexture}
                onEnded={this.props.fnOnImageEnd}
                extraData={++this._extraData}
            // extraScale={[{
            //     x: this.outsizeWidth / DesignConvert.getW(93),
            //     y: this.outsizeHeight / DesignConvert.getW(93),
            // }]}
            // loopTimes={0}
            />
        )
    }
}
