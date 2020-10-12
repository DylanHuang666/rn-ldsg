'use strict';

import React, { PureComponent } from "react";
import { Text, TouchableOpacity } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";

export default class _RoomTalkItem extends PureComponent {

    _onChat = () => {
        require('../../../../utils/ModelEvent').default.dispatchEntity(
            null,
            require('../../../../hardcode/HLogicEvent').EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE,
            true
        )
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.getW(65),
                    height: DesignConvert.getH(32),
                    marginLeft: DesignConvert.getW(15),
                    marginRight: DesignConvert.getW(8),
                    // backgroundColor: '#FFFFFF40',
                    // borderRadius: DesignConvert.getW(17),
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={this._onChat}
            >
                <Text
                    style={{
                        fontSize: DesignConvert.getF(12),
                        color: '#FFFFFF',
                    }}
                >说句话…</Text>
            </TouchableOpacity>
        );
    }

    // render() {
    //     return (
    //         <TouchableOpacity
    //             style={{
    //                 width: DesignConvert.getW(82),
    //                 height: DesignConvert.getH(32),
    //                 marginLeft: DesignConvert.getW(15),
    //                 marginRight: DesignConvert.getW(8),
    //                 height: DesignConvert.getH(32),
    //                 backgroundColor: '#FFFFFF40',
    //                 borderRadius: DesignConvert.getW(17),
    //                 flexDirection: 'row',
    //                 alignItems: 'center',
    //             }}
    //             onPress={this._onChat}
    //         >
    //             <Image
    //                 style={{
    //                     width: DesignConvert.getW(18),
    //                     height: DesignConvert.getH(18),
    //                     marginLeft: DesignConvert.getW(8),
    //                     marginRight: DesignConvert.getW(6),
    //                     resizeMode: 'contain',
    //                 }}
    //                 source={ic_chat()}
    //             />
    //             <Text
    //                 style={{
    //                     fontSize: DesignConvert.getF(10),
    //                     color: '#FFFFFFCC',
    //                 }}
    //             >聊几句吧</Text>
    //         </TouchableOpacity>
    //     );
    // }
}