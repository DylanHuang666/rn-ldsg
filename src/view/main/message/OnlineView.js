/**
 * 在线的人
 */
'use strict';

import React, { PureComponent } from 'react';
import BaseView from '../../base/BaseView';
import BackTitleView from '../../base/BackTitleView';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Modal, FlatList, SectionList } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';
import DatePicker from 'react-native-date-picker';
import Picker from 'react-native-wheel-picker';
import Config from '../../../configs/Config';
import moment from 'moment';
import { COIN_NAME } from '../../../hardcode/HGLobal';
import StringUtil from '../../../utils/StringUtil';
import UserInfoCache from '../../../cache/UserInfoCache';
import LinearGradient from 'react-native-linear-gradient';
import { LINEARGRADIENT_COLOR } from '../../../styles';
import OnlineList from './OnlineList';

export default class OnlineView extends BaseView {

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    flex: 1,
                }}>
                <BackTitleView
                    titleText={"在线的人"}
                    onBack={this.popSelf}
                    bgColor={LINEARGRADIENT_COLOR}
                    titleTextStyle={{
                        color: "white",
                    }}
                    backImgStyle={{
                        tintColor: "white",
                    }}
                />

                <OnlineList />
            </View>
        )
    }
}