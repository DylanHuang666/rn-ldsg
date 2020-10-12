
/**
 *  房间 -> 管理员
 */
'use strict';

import React, { PureComponent } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, Modal, } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";


class DialogView extends PureComponent {
    constructor(props) {
        super(props);

        this._visible = false;
    }

    showDia = () => {
        this._visible = true;
        this.forceUpdate();
    }

    dissmissDia = () => {
        this._visible = false;
        this.forceUpdate();
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this._visible}
                onRequestClose={this.dissmissDia}
            >

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            width: DesignConvert.swidth - DesignConvert.getW(120),
                            borderRadius: DesignConvert.getW(10),
                            backgroundColor: "white",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: DesignConvert.getW(22),
                        }}
                    >
                        <Text
                            style={{
                                color: "#000000",
                                fontSize: DesignConvert.getF(13),
                                marginTop: DesignConvert.getH(20),
                                marginBottom: DesignConvert.getH(20),
                            }}
                        >{this.props.dialogContent}</Text>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: DesignConvert.getW(103),
                                    height: DesignConvert.getW(40),
                                    backgroundColor: "#F5F5F5",
                                    borderRadius: DesignConvert.getW(20),
                                    marginRight: DesignConvert.getW(24),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    textAlignVertical: "center",
                                }}
                                onPress={this.dissmissDia}>

                                <Text
                                    style={{
                                        color: "#1A1A1A",
                                        fontSize: DesignConvert.getF(13),
                                        textAlign: "center",
                                    }}
                                >取消</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    width: DesignConvert.getW(103),
                                    height: DesignConvert.getW(40),
                                    backgroundColor: "#FA495F",
                                    borderRadius: DesignConvert.getW(20),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    textAlignVertical: "center",
                                }}
                                onPress={this.props.positiveClick}>

                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: DesignConvert.getF(13),
                                        textAlign: "center",
                                    }}
                                >确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

export default class RoomManagerView extends BaseView {

    constructor(props) {
        super(props);

        this._roomId = !this.props.params.roomId ? "A7529881" : this.props.params.roomId;
        this._list = [];

        this._isLoading = false;
        this._targetId = "";

    }

    _onBackPress = () => {
        this.popSelf();
    }

    _onRefresh = () => {
        this._isLoading = true;
        this.forceUpdate();
        this._initData();
    }

    _getDialog = ref => {
        this._dialog = ref;
    }

    _removeRoomManager = () => {
        require("../../model/room/RoomManagerModel").default.removeRoomManager(this._roomId, this._targetId)
            .then(data => {
                this._initData();
                this.forceUpdate();
            });
    }

    _initData() {
        require("../../model/room/RoomManagerModel").default.getRoomManagerList(this._roomId)
            .then(data => {
                this._list = data;
                // console.log("房管", this._list)
                this._isLoading = false;
                this.forceUpdate();
            });
    }

    componentDidMount() {
        super.componentDidMount();
        this._initData();
    }

    _renderItem = ({ item }) => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(70),
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        require("../../router/level2_router").showUserInfoView(item.base.userId);
                    }}>

                    <Image
                        source={{ uri: require("../../configs/Config").default.getHeadUrl(item.base.userId, item.base.logoTime, item.base.thirdIconurl) }}
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(50),
                            marginLeft: DesignConvert.getW(15),
                            borderRadius: DesignConvert.getW(25),
                        }}></Image>
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        marginLeft: DesignConvert.getW(12),
                        height: DesignConvert.getH(50),
                        justifyContent: 'space-around',
                    }}
                >
                    <Text
                        style={{
                            color: "#333333",
                            fontSize: DesignConvert.getF(13),
                        }}
                    >{decodeURI(item.base.nickName)}</Text>

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(11),
                            color: '#B8B8B8'
                        }}
                    >
                        {`ID:${item.base.userId}`}
                    </Text>

                    {/* <Image
                            source={item.base.sex == 2 ? require("../../hardcode/skin_imgs/common").sex_female() : require("../../hardcode/skin_imgs/common").sex_male()}
                            style={{
                                width: DesignConvert.getW(15),
                                height: DesignConvert.getH(15),
                            }}
                        ></Image> */}
                    {/* <Text
                        style={{
                            color: "#808080",
                            fontSize: DesignConvert.getF(12),
                        }}
                    >{decodeURI(item.base.slogan)}</Text> */}

                </View>


                <TouchableOpacity
                    onPress={() => {
                        this._targetId = item.base.userId;
                        require("../../router/level2_router").showNormTitleInfoDialog(`是否将${decodeURI(item.base.nickName)}移除黑名单列表？`, "确定", this._removeRoomManager, "提示")
                    }}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: DesignConvert.getW(54.5),
                        height: DesignConvert.getH(24),
                        marginRight: DesignConvert.getW(15),
                        borderColor: '#FF95A4',
                        borderWidth: DesignConvert.getW(1),
                        borderRadius: DesignConvert.getW(20),
                    }}
                >
                    <Text
                        style={{
                            fontSize: DesignConvert.getW(13),
                            color: '#FF95A4',
                        }}
                    >

                        {`解除`}
                    </Text>

                </TouchableOpacity>

            </View>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}>

                <BackTitleView
                    titleText={'管理员'}
                    onBack={this._onBackPress}
                />

                {/* <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(20),
                        backgroundColor: "#E4E3E7",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(10),
                            color: "#999999",
                        }}
                    >tip:管理员不得超过10人</Text>
                </View> */}

                <FlatList
                    style={{
                        flex: 1,
                    }}
                    data={this._list}
                    renderItem={this._renderItem}
                    refreshing={this._isLoading}
                    onRefresh={this._onRefresh}
                />

                <DialogView
                    ref={this._getDialog}
                    dialogContent="您要撤销该管理员吗？"
                    positiveClick={this._removeRoomManager}></DialogView>
            </View>
        );
    }
}
