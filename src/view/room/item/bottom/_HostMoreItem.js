'use strict';

import React, { PureComponent } from "react";
import { Image, TouchableOpacity } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import { ic_more } from "../../../../hardcode/skin_imgs/room";

/**
 * 打开直播间更多功能
 */
export default class _HostMoreItem extends PureComponent {

    _onMore = () => {
        require("../../../../router/level3_router").showRoomMoreView();
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    marginRight: DesignConvert.getW(8),
                }}
                onPress={this._onMore}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(32),
                        height: DesignConvert.getH(32),
                    }}
                    source={ic_more()}
                />
            </TouchableOpacity>
        );
    }
}