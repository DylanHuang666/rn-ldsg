
/**
 * 键盘
 */

import React, { PureComponent } from "react";
import { Platform, KeyboardAvoidingView, View } from "react-native";


export default class KeyboardAvoidingViewExt extends PureComponent {

    render() {
        if (Platform.OS == 'android') {
            return (
                <KeyboardAvoidingView
                    {...this.props}
                />
            )
        }

        return (
            <View
                {...this.props}
            />
        )
    }
}