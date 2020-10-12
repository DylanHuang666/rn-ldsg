'use strict';

import React, { PureComponent } from 'react';
import { requireNativeComponent } from 'react-native';

const RCTAlphaVideoView = requireNativeComponent('RCTAlphaVideoView');

export default class AlphaVideoView extends PureComponent {

    constructor(props) {
        super(props);
    }

    _doDownloadFile(url) {
        if (!url) return;

        if (this._saveFile) return;

        require('../../model/file/DownloadModel').downloadMp4File(url)
        .then(ret => {
            if (this.props.url != url) return;

            if (1 != ret.state || !ret.file) {
                this.props.onError && this.props.onError();
                return;
            }
            this._saveFile = ret.file;
            this.forceUpdate();
        })
    }

    _onEnd = () => {
        this._saveFile = null;

        this.props.onEnd && this.props.onEnd();
    }

    _onError = (evt) => {
        this._saveFile = null;

        this.props.onError && this.props.onError(evt);
    }


    render() {
        if (!this._saveFile) {
            this._doDownloadFile(this.props.url);
            return null;
        }
        return (
            <RCTAlphaVideoView
                // ref={(ref) => this._ref = ref}
                style={this.props.style}
                url={this._saveFile}
                extraData={this.props.extraData}
                onEnd={this._onEnd}
                onError={this._onError}
            />
        );
    };
}
