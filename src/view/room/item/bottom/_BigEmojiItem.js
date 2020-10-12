import React, { PureComponent } from 'react';
import { TouchableOpacity } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import { ic_big_emoji } from "../../../../hardcode/skin_imgs/room_more";
import { Image } from "react-native";


/**
 * 大表情
 */
export default class _BigEmojiItem extends PureComponent {

    _onPress = () => {
        require('../../../../router/level3_router').showRoomBigFaceView()
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    marginRight: DesignConvert.getW(8)
                }}
                onPress={this._onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(34),
                        height: DesignConvert.getH(34),
                    }}
                    source={ic_big_emoji()}
                />

            </TouchableOpacity>
        )
    }
}