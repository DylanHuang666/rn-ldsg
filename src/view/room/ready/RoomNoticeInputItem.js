/**
 * 开播设置 -> 房间公告
 */
'use strict';

import React, { PureComponent } from 'react';
import { Text, TextInput, View } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';

export default class RoomNoticeInputItem extends PureComponent {

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    left: DesignConvert.getW(34),
                    top: DesignConvert.statusBarHeight + DesignConvert.getH(249),

                    width: DesignConvert.getW(307),
                    height: DesignConvert.getH(170),

                    borderRadius: DesignConvert.getW(12),

                    backgroundColor: '#78787880',

                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    // alignItems: 'flex-start',
                }}
            >
                <Text
                    style={{
                        marginTop: DesignConvert.getH(16),
                        marginLeft: DesignConvert.getW(16),
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: DesignConvert.getF(14),
                    }}
                >房间公告:</Text>

                <TextInput
                    style={{
                        marginTop: DesignConvert.getH(16),
                        marginLeft: DesignConvert.getW(5),

                        width: DesignConvert.getW(129 + 98 - 25),
                        padding: 0,
                        // flex: 1,
                        // lineHeight: DesignConvert.getH(20),

                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(14),

                        textAlignVertical: 'top',
                    }}
                    multiline={true}
                    maxLength={200}
                    underlineColorAndroid="transparent"
                    placeholder="请输入房间公告~"
                    placeholderTextColor="#808080"
                    editable={Boolean(this.props.selectData)}
                    defaultValue={this.props.roomNotice}
                    onChangeText={this.props.onChangeRoomNotice}
                />

            </View>
        )
    }
}