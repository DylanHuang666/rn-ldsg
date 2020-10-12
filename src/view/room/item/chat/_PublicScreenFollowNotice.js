'use strict';

import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";

export default class _PublicScreenMessageItem extends PureComponent {

    _onSender = () => {
        require('../../../../model/room/RoomUserClickModel').onClickUser(this.props.data.sender.userId, this.props.data.sender.nickName)
    }

    render() {
        const followText = decodeURIComponent(this.props.data.sender.nickName);
        const contributeLv = this.props.data.sender.contributeLv;

        return (
            <View
                style={{
                    marginBottom: DesignConvert.getH(10),
                    // minWidth: DesignConvert.getW(100),

                    backgroundColor: '#FFFFFF19',
                    borderRadius: DesignConvert.getW(4),
                    padding: DesignConvert.getW(10),

                    // flexWrap: 'wrap',

                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    // alignItems: 'center',
                }}
            >
                <Image
                    source={require("../../../../hardcode/skin_imgs/main").mine_rich_lv(contributeLv)}
                    style={{
                        width: DesignConvert.getW(36.7),
                        height: DesignConvert.getH(15),
                        marginRight: DesignConvert.getW(3),
                    }}></Image>

                <TouchableOpacity
                    onPress={this._onSender}
                >
                    <Text
                        style={{
                            color: "#049EFF",
                            fontSize: DesignConvert.getF(11),
                        }}
                    >
                        {followText}
                        <Text
                            style={{
                                color: "#FC5353"
                            }}
                        >
                            关注了房主
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}