/**
 * 所有注册的screen的基类
 */

'use strict';

import React, {Component} from 'react';
import { View } from 'react-native';

export default class BaseView extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * component生命周期的 didMount
     * 如果override了，必须要在第一行执行 super.componentDidMount()
     */
    componentDidMount() {
        require('../../router/ScreensHelper').default.onBaseViewMount(this);
        // this.props && this.props.__screenId__ && require('../../model/umeng/UmengModel').onPageStart(this.props.__screenId__);
    }

    /**
     * component生命周期的 willUnmount
     * 如果override了，必须要在第一行执行 super.componentWillUnmount()
     */
    componentWillUnmount() {
        require('../../router/ScreensHelper').default.onBaseViewUnmout(this);
        // this.props && this.props.__screenId__ && require('../../model/umeng/UmengModel').onPageEnd(this.props.__screenId__);
    }

    /**
     * 是否最顶层窗体(model/overlay)
     */
    isOverlayView() {
        return this.props && this.props.__screen__ && this.props.__viewType__ == require('../../router/ScreensHelper').VIEW_TYPE_OVERLAY;
    }

    /**
     * 弹出自己
     */
    popSelf = () => {
        if (!this.props || !this.props.__screen__) return;
        require('../../router/ScreensHelper').default.close(this.props.__screen__, false);
    }

    /**
     * 从界面栈中，弹出到自己的界面
     */
    popToSelf = () => {
        if (!this.props || !this.props.__screen__) return;
        require('../../router/ScreensHelper').default.popToScreen(this.props.__screen__, false);
    }

    render() {
        return (
            <View style={{flex: 1}}>
            </View>
        )
    }
}