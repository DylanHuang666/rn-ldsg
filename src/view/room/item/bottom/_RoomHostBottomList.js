'use strict';

import React, { PureComponent } from "react";
import { View } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import _GiftItem from "./_GiftItem";
import _MessageItem from "./_MessageItem";
import _SpeakerItem from "./_SpeakerItem";
import _MicItem from "./_MicItem";
import _MicQueueItem from './_MicQueueItem';
import _HostMoreItem from './_HostMoreItem';

export default class _RoomHostBottomList extends PureComponent {

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: DesignConvert.getH(10),
                    right: DesignConvert.getW(7),

                    flexDirection: 'row-reverse',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >

                <_GiftItem />

                <_MessageItem />

                <_SpeakerItem />

                <_MicItem />

                <_MicQueueItem />

                <_HostMoreItem />

            </View>
        );
    }
}