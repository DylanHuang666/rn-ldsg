/**
 * 开播设置 -> 房间名称
 */
'use strict';

import React, { PureComponent } from 'react';
import { Text, TextInput, View } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';

export default class RoomNameInputItem extends PureComponent {

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    left: DesignConvert.getW(34),
                    top: DesignConvert.statusBarHeight + DesignConvert.getH(184),

                    width: DesignConvert.getW(307),
                    height: DesignConvert.getH(50),

                    borderRadius: DesignConvert.getW(12),

                    backgroundColor: '#78787880',

                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        marginLeft: DesignConvert.getW(16),
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: DesignConvert.getF(14),
                    }}
                >房间标题:</Text>

                <TextInput
                    style={{
                        marginLeft: DesignConvert.getW(5),

                        width: DesignConvert.getW(280),

                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(14),
                    }}
                    maxLength={15}
                    underlineColorAndroid="transparent"
                    placeholder="给房间去一个好听的名字吧~"
                    placeholderTextColor="#808080"
                    editable={Boolean(this.props.selectData)}
                    defaultValue={this.props.roomName}
                    onChangeText={this.props.onChangeRoomName}
                />

            </View>
        )
    }
}