/**
 * app更新提示界面
 */
'use strict';

import React, { Component, PureComponent } from "react";
import { Image, NativeModules, Platform, Text, TouchableOpacity, View } from 'react-native';
import { ic_app_new_version } from '../../hardcode/skin_imgs/update';
import { FileDownloaderWithPath } from "../../model/file/DownloadModel";
import DesignConvert from '../../utils/DesignConvert';
import { getUrlBaseName } from "../../utils/StringUtil";
import BaseView from '../base/BaseView';
import ToastUtil from "../base/ToastUtil";

class _ForceUpdateItem extends PureComponent {

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.fnOnDownload}
            >
                <View
                    style={{
                        marginTop: DesignConvert.getH(16),

                        width: DesignConvert.getW(305),

                        // flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: DesignConvert.getW(250),
                            height: DesignConvert.getH(36),

                            borderRadius: DesignConvert.getW(18),

                            backgroundColor: '#F63D6E',

                            // flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(15),
                                color: 'white',
                            }}
                        >马上更新</Text>
                    </View>
                </View>

            </TouchableOpacity>
        );
    }
}

class _SoftUpdateItem extends PureComponent {

    render() {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getH(16),

                    width: DesignConvert.getW(305),

                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={this.props.fnOnClose}
                >
                    <View
                        style={{
                            width: DesignConvert.getW(125),
                            height: DesignConvert.getH(36),

                            borderRadius: DesignConvert.getW(18),
                            borderColor: '#F63D6E',
                            borderWidth: DesignConvert.getBorderWidth(1),

                            // flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(15),
                                color: '#F63D6E',
                            }}
                        >取消</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        marginLeft: DesignConvert.getW(15),
                    }}
                    onPress={this.props.fnOnDownload}
                >
                    <View
                        style={{
                            width: DesignConvert.getW(125),
                            height: DesignConvert.getH(36),

                            borderRadius: DesignConvert.getW(36),
                            backgroundColor: '#F63D6E',

                            // flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(15),
                                color: 'white',
                            }}
                        >安装</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

class _DownloadingItem extends Component {

    constructor(props) {
        super(props);

        this._downloadBytes = 0;
        this._fileSize = 100;

        this._startDownload(this.props.url);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.url == nextProps.url) {
            return false;
        }

        this._startDownload(url);
        return false;
    }

    _startDownload(url) {
        let downloader;
        downloader = new FileDownloaderWithPath(
            url,
            (downloadBytes, fileSize) => {
                if (this._downloader != downloader) return;

                this._downloadBytes = downloadBytes;
                if (fileSize <= downloadBytes) {
                    fileSize = downloadBytes + 100;
                }
                this._fileSize = fileSize;

                this.forceUpdate();
            },
            ret => {
                if (downloader != this._downloader) return;

                if (1 == ret.state) {
                    this.props.fnOnDownloaded(ret.file);
                } else {
                    this.props.fnOnDownloaded(null);

                    ToastUtil.showCenter('下载失败');
                }
            }
        );
        this._downloader = downloader;

        const savePath = 'apks/' + getUrlBaseName(url);
        downloader.download(savePath)
    }

    _renderProgress() {

        const maxW = DesignConvert.getW(245);
        const nowW = this._downloadBytes / this._fileSize * maxW;

        return (
            <View
                style={{
                    width: maxW,
                    height: DesignConvert.getH(15),

                    borderRadius: DesignConvert.getW(15),
                    borderColor: '#F63D6E',
                    borderWidth: DesignConvert.getBorderWidth(1),
                }}
            >
                <View
                    style={{
                        width: nowW,
                        height: DesignConvert.getH(15),

                        borderRadius: DesignConvert.getW(15),
                        backgroundColor: '#F63D6E',
                    }}
                />
            </View>
        );
    }

    _renderCancelBtn() {
        if (!this.props.bShowCancel) return null;

        return (
            <TouchableOpacity
                onPress={this.props.fnOnClose}
            >
                <View
                    style={{
                        width: DesignConvert.getW(125),
                        height: DesignConvert.getH(36),

                        borderRadius: DesignConvert.getW(18),
                        borderColor: '#F63D6E',
                        borderWidth: DesignConvert.getBorderWidth(1),

                        // flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(15),
                            color: '#F63D6E',
                        }}
                    >取消</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getH(16),

                    width: DesignConvert.getW(305),

                    // flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                {this._renderProgress()}

                {this._renderCancelBtn()}
            </View>
        );
    }
}

class _DownloadedItem extends PureComponent {

    render() {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getH(10),

                    width: DesignConvert.getW(305),

                    // flexDirection: 'column',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',

                }}
            >
                <TouchableOpacity
                    onPress={this.props.fnOnInstall}
                >
                    <View
                        style={{
                            width: DesignConvert.getW(125),
                            height: DesignConvert.getH(36),

                            borderRadius: DesignConvert.getW(36),
                            backgroundColor: '#F63D6E',

                            // flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(15),
                                color: 'white',
                            }}
                        >安装</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const ST_FORCE = 0;         //强更
const ST_SOFT = 1;          //软更
const ST_DOWNLOADING = 2;   //下载中
const ST_DONWLOADED = 3;    //下载完成

export default class AppVersionUpdatePage extends BaseView {

    constructor(props) {
        super(props);

        // "keys":["channelid","channelname","version","downloadurl","forceupdate","iospaytype","issanbox","desc","newvisitor","oldvisitor"]
        // this.props.params.channelInfo

        this._initViewSate();
    }

    _initViewSate() {
        this._viewState = this.props.params.channelInfo.forceupdate == 1 ? ST_FORCE : ST_SOFT;
    }

    _onDownload = () => {
        if (ST_DOWNLOADING == this._viewState) return;
        if (ST_DONWLOADED == this._viewState) return;

        if (Platform.OS == 'android') {
            //切换为下载中
            this._viewState = ST_DOWNLOADING;
            this.forceUpdate();
        } else {
            alert('请联系官方人员拿安装包');
        }

    }

    _onDownloaded = (filePath) => {
        if (!filePath) {
            //下载失败

            //切换为原来的
            this._initViewSate();
            this.forceUpdate();
            return;
        }

        //切换为下载完成
        this._filePath = filePath;
        this._viewState = ST_DONWLOADED;
        this.forceUpdate();
    }

    _onInstall = () => {
        NativeModules.HttpUtil.installApk(this._filePath);
        // NativeModules.HttpUtil.installApk('/sdcard/1.apk');
    }

    _onClose = () => {
        if (this.props.params.channelInfo.forceupdate == 1) return;

        this.popSelf();
    }

    _renderByState() {
        switch (this._viewState) {
            case ST_FORCE:
                return (
                    <_ForceUpdateItem
                        fnOnDownload={this._onDownload}
                    />
                )

            case ST_SOFT:
                return (
                    <_SoftUpdateItem
                        fnOnClose={this._onClose}
                        fnOnDownload={this._onDownload}
                    />
                )

            case ST_DOWNLOADING:
                return (
                    <_DownloadingItem
                        fnOnClose={this._onClose}
                        fnOnDownloaded={this._onDownloaded}
                        url={this.props.params.channelInfo.downloadurl}
                        bShowCancel={this.props.params.channelInfo != 1}
                    />
                )

            // case ST_DONWLOADED:
            default:
                return (
                    <_DownloadedItem
                        fnOnInstall={this._onInstall}
                        filePath={this._filePath}
                    />
                )
        }
    }

    render() {

        // const content = '更新内容\n1. 解决已知BUG问题\n2. 添加砸蛋功能\n3. ..............'
        const content = this.props.params.channelInfo.desc.replaceAll('\\n', '\n');

        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: "center",
                }}>

                <TouchableOpacity
                    onPress={this._onClose}
                    style={{
                        flex: 1,
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        position: 'absolute',
                    }}
                />

                <View
                    style={{
                        borderRadius: DesignConvert.getW(10),
                        width: DesignConvert.getW(305),
                    }}
                >
                    <Image
                        source={ic_app_new_version()}
                        style={{
                            width: DesignConvert.getW(305),
                            height: DesignConvert.getH(166)
                        }}
                    />

                    <View
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderBottomLeftRadius: DesignConvert.getW(10),
                            borderBottomRightRadius: DesignConvert.getW(10),
                            marginTop: -1,      // 把下面白块这块往上顶一个像素, 遮掉一条细微的线

                            paddingBottom: DesignConvert.getH(10),
                        }}
                    >
                        <Text
                            style={{
                                marginTop: DesignConvert.getH(12),
                                marginLeft: DesignConvert.getW(24),
                                width: DesignConvert.getW(250),
                                fontSize: DesignConvert.getF(15),
                                color: '#000000',
                                lineHeight: DesignConvert.getH(24),
                            }}
                        >{content}</Text>

                        {this._renderByState()}
                    </View>

                </View>

            </View>
        )
    }
}