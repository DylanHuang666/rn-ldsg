/**
 * 首页 -> 搜索
 */
'use strict';

import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, ScrollView } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../utils/DesignConvert';
import Config from '../../configs/Config';
import BackTitleView from '../base/BackTitleView';
import StatusBarView from '../base/StatusBarView';
import BaseView from '../base/BaseView';
import { ic_back_black } from '../../hardcode/skin_imgs/common';
import { live_status_white } from '../../hardcode/skin_imgs/main';
import ToastUtil from '../base/ToastUtil';
import ModelEvent from '../../utils/ModelEvent';
import { EVT_LOGIC_UPDATE_USER_INFO } from '../../hardcode/HLogicEvent';


class _TagItem extends PureComponent {

    _onChangeText = () => {
        // console.log("_onChangeText");
        this.props.onPress && this.props.onPress(this.props.tagText);
    };

    render() {
        return (
            <TouchableOpacity
                onPress={this._onChangeText}>
                <Text
                    style={{
                        color: '#808080',
                        marginLeft: DesignConvert.getW(15),
                        marginRight: DesignConvert.getW(15),
                        marginTop: DesignConvert.getH(5),
                        marginBottom: DesignConvert.getH(5),
                        paddingLeft: DesignConvert.getW(10),
                        paddingRight: DesignConvert.getW(10),
                        paddingTop: DesignConvert.getH(5),
                        paddingBottom: DesignConvert.getH(5),
                        backgroundColor: '#F2F2F2',
                        borderRadius: DesignConvert.getW(4),
                    }}>{this.props.tagText}</Text>
            </TouchableOpacity>
        );
    }
}

export default class SearchView extends BaseView {

    constructor(props) {
        super(props);

        this._searchKey = '';
        this._userList = [];
        this._start = 1;
        this._end = 10;
        this._loadMoreEnable = false;
        this._roomList = [];
        this._index = 0;
        this._roomLoadMoreEnable = false;
        this._timer = null
        this._searchList = [];

        this._isShowRecord = true;
    }

    _onBackPress = () => {
        this.popSelf();
    };

    _onChangeSearchKey = (s) => {
        this._searchKey = s;
        this._isShowRecord = true;
        if (this._searchKey == '') {
            this.forceUpdate();
            this._updateSearchRecord();
        } else {
            this.forceUpdate();
        }

    };

    _onSearchTagPress = (s) => {
        this._searchKey = s;
        this._onSearch();

    };

    _updateSearchRecord() {
        require('../../model/SearchModel').default.getSearchKeyStorage(this._searchKey)
            .then(data => {
                this._searchList = data;
                this.forceUpdate();
            });
    }

    _initUserData = () => {
        // console.log('wwwwwwwwwww', 'cheng')
        if (!this._searchKey) return
        require('../../model/SearchModel').default.searchUserInfoList(this._searchKey, this._start, this._end)
            .then(data => {
                // if(!data) return
                // console.log("_onSearch", data);
                if (this._start > 1) {
                    this._userList = this._userList.concat(data);
                } else {
                    this._userList = data;
                }
                this._userList = data;
                // this._start += 10;
                // this._end += 10;
                // this._loadMoreEnable = data.length > 0;
                this.forceUpdate();
            });
    };

    _initRoomData = () => {
        require('../../model/SearchModel').default.searchRoom(this._searchKey, this._index)
            .then(data => {
                // console.log("searchRoom", data);
                if (this._index > 0) {
                    this._roomList = this._roomList.concat(data);
                } else {
                    this._roomList = data;
                }
                this._index = this._index + this._roomList.length;
                this._roomLoadMoreEnable = data.length > 0;
                this.forceUpdate();
            });
    };

    _onSearch = () => {
        if (!this._searchKey) {
            return;
        }
        this._isShowRecord = false;
        this._start = 1;
        this._end = 10;
        this._initUserData();

        this._index = 0;
        this._initRoomData();
        require('../../model/SearchModel').default.saveSearchKeyStorage(this._searchKey);
    };

    _onClosedPress = () => {
        this._searchKey = '';
        this._updateSearchRecord();
    };

    _getRoomType = (roomType) => {
        let roomTypeName = '其他';
        this._roomTypeList.forEach(element => {
            if (roomType == element.id) {
                roomTypeName = element.type;
            }
        });
        return roomTypeName;
    };

    componentDidMount() {
        super.componentDidMount();
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_USER_INFO, this._initUserData);
        require('../../model/main/HomePageModel').default.getRoomTypeList()
            .then(list => {
                this._roomTypeList = list;
                this.forceUpdate();
            });
        // console.log('wwwww', 'xianmu')
        this._updateSearchRecord();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_USER_INFO, this._initUserData);
        // console.log('tuichu', 'adas')
    }

    _loadMore = () => {
        if (this._loadMoreEnable) {
            this._initUserData();
        }
    };

    _roomLoadMore = () => {
        if (this._roomLoadMoreEnable) {
            this._initRoomData();
        }
    };

    _enterLiveRoom = (item) => {
        require('../../model/room/RoomModel').default.enterLiveRoom(item.roomId, 0);
    };

    _renderItem = ({ item }) => {
        return <TouchableOpacity
            onPress={() => {
                this._enterLiveRoom(item);
            }}
            activeOpacity={0.8}
            style={{ flexDirection: 'row', width: DesignConvert.swidth, alignItems: 'center', marginBottom: DesignConvert.getH(18) }}>

            <View style={{}}>
                <Image
                    source={{ uri: Config.getRoomCreateLogoUrl(item.logoTime, item.roomId, item.base.userId, item.base.logoTime, item.base.thirdIconurl) }}
                    style={{
                        width: DesignConvert.getW(50),
                        height: DesignConvert.getH(50),
                        borderRadius: DesignConvert.getW(12),
                    }}>
                </Image>
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: DesignConvert.getW(70),
                        height: DesignConvert.getH(22),
                        borderRadius: DesignConvert.getW(11),
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#000000',
                        opacity: 0.5,
                    }}
                >
                    <Image style={{
                        width: DesignConvert.getW(7),
                        height: DesignConvert.getH(10.5),
                        marginRight: DesignConvert.getW(3),
                    }} source={require('../../hardcode/skin_imgs/search').hot_fire()}>
                    </Image>
                    <Text style={{
                        fontSize: DesignConvert.getF(10),
                        color: '#FFFFFF'
                    }}>热度<Text
                        style={{
                            fontSize: DesignConvert.getF(13),
                            fontWeight: "bold",
                        }}
                    >{item.onlineNum}</Text></Text>
                </View>

            </View>


            <View style={{
                justifyContent: 'center',
                marginLeft: DesignConvert.getW(7)
            }}>
                <Text
                    style={{
                        fontSize: DesignConvert.getF(14),
                        color: '#FFFFFF',
                    }}>{decodeURI(item.base.nickName)}</Text>
                
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    <Text
                    style={{
                        marginTop: DesignConvert.getH(3),
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontSize: DesignConvert.getF(12)
                    }}
                >房间ID:{item.base.userId}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            height: DesignConvert.getH(20),
                            marginLeft: DesignConvert.getW(10)
                        }}
                    >
                        <Image
                            source={require("../../hardcode/skin_imgs/main").live_status_white()}
                            style={{
                                width: DesignConvert.getW(10),
                                height: DesignConvert.getH(10),
                                resizeMode: 'contain',
                                tintColor: '#FF2049',
                                marginLeft: DesignConvert.getW(8),
                            }} />
                        <Text
                            numberOfLines={1}
                            style={{
                                maxWidth: DesignConvert.getW(95),
                                fontWeight: 'bold',
                                color: '#FFFFFF',
                                fontSize: DesignConvert.getF(12),
                                marginLeft: DesignConvert.getW(5)
                            }}>{decodeURI(item.onlineNum)}</Text>
                    </View>
                </View>
            </View>

            <Image
                style={{
                    width: DesignConvert.getW(6.5),
                    height: DesignConvert.getH(11),
                    resizeMode: 'contain',
                    position: 'absolute',
                    right: DesignConvert.getW(50)
                }}
                source={require('../../hardcode/skin_imgs/search').ic_next()}
            />
        </TouchableOpacity>;

    };
    _renderEmptyView = () => {
        return (
            <View
                style={{
                    height: DesignConvert.getH(400),
                    // width: DesignConvert.swidth,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    source={require('../../hardcode/skin_imgs/main').no_live2()}
                    style={{
                        width: DesignConvert.getW(109),
                        height: DesignConvert.getH(96.5),
                    }}></Image>
                <Text style={{
                    marginTop: DesignConvert.getH(16.5),
                    color: '#797979',
                    fontSize: DesignConvert.getF(15),
                }}>搜不到聊天室
                </Text>
            </View>
        );
    };
    _renderEmptyViewUser = () => {
        return (
            <View
                style={{
                    height: DesignConvert.getH(400),
                    // width: DesignConvert.swidth,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    source={require('../../hardcode/skin_imgs/search').default_no_user()}
                    style={{
                        width: DesignConvert.getW(109),
                        height: DesignConvert.getH(96.5),
                    }}></Image>
                <Text style={{
                    marginTop: DesignConvert.getH(16.5),
                    color: '#797979',
                    fontSize: DesignConvert.getF(15),
                }}>搜不到用户
                </Text>
            </View>
        );
    };

    _onUserItemPress = (item) => {
        require('../../router/level2_router').showUserInfoView(item.base.userId);
    };

    _renderUserItem = ({ item }) => {
        return (<TouchableOpacity
            onPress={() => {
                this._onUserItemPress(item);
            }}
            style={{
                marginTop: 0,
                width: DesignConvert.swidth,
                alignItems: 'center',
                marginBottom: DesignConvert.getH(15),
                flexDirection: 'row',
            }}>

            <Image
                source={{ uri: Config.getHeadUrl(item.base.userId, item.base.logoTime, item.base.thirdIconurl) }}
                style={{
                    width: DesignConvert.getW(44),
                    height: DesignConvert.getH(44),
                    // borderColor: "#F63B6D",
                    borderRadius: DesignConvert.getW(22),
                    // borderWidth: DesignConvert.getW(1),
                    // padding: DesignConvert.getW(1),
                }}></Image>
            <View
                style={{
                    justifyContent: 'center',
                    marginLeft: DesignConvert.getW(7)
                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ fontSize: DesignConvert.getF(14), color: '#FFFFFF' }}>
                        {decodeURI(item.base.nickName)}
                    </Text>
                    <Image
                        source={item.base.sex == 1 ? require('../../hardcode/skin_imgs/search').sex_man() : require('../../hardcode/skin_imgs/search').sex_famale()}
                        style={{
                            width: DesignConvert.getW(13),
                            height: DesignConvert.getW(13),
                            marginLeft: DesignConvert.getW(6),
                        }}
                    />

                </View>
                <Text
                    style={{
                        marginTop: DesignConvert.getH(3),
                        color: '#999999',
                        fontSize: DesignConvert.getF(12)
                    }}
                >ID:{item.base.userId}</Text>
            </View>
            <Image
                style={{
                    width: DesignConvert.getW(6.5),
                    height: DesignConvert.getH(11),
                    resizeMode: 'contain',
                    position: 'absolute',
                    right: DesignConvert.getW(50)
                }}
                source={require('../../hardcode/skin_imgs/search').ic_next()}
            />
            {/* <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#66B8FF', '#39D7F0']}
                    style={{
                        height: DesignConvert.getW(13),
                        marginLeft: DesignConvert.getW(4.5),
                        borderRadius: DesignConvert.getW(6.5),
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: DesignConvert.getW(5),
                    }}>
                    <Text style={{ fontSize: DesignConvert.getF(10), color: '#fff' }}>Lv{item.base.contributeLv}</Text>
                </LinearGradient> */}

            {/* <TouchableOpacity
                style={{
                    width: DesignConvert.getW(44),
                    height: DesignConvert.getW(20),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#A055FF',
                    // backgroundColor: 'red',
                    borderRadius: DesignConvert.getW(4),
                    display: item.friendStatus === 4 || item.friendStatus === 0 ? 'flex' : 'none',
                    // display: item
                }}
                onPress={async () => {
                    let res = await require("../../model/userinfo/UserInfoModel").default.addLover(item.base.userId, true);
                    if (res) {
                        ToastUtil.showBottom("关注成功");
                    } else {
                        ToastUtil.showBottom("关注失败");
                        // this._isAttention = false;
                        // this._initUserData()
                    }
                    // this.forceUpdate();
                    this._initUserData()
                }}>
                <Text style={{ fontSize: DesignConvert.getF(10), color: '#fff' }}>
                    关注
                </Text>
            </TouchableOpacity> */}

        </TouchableOpacity>)
    };

    _keyUserExtractor = (item, index) => item.base.userId;

    _keyRoomExtractor = (item, index) => item.roomId;

    _renderContent = () => {
        if (this._searchKey == '' || this._isShowRecord) {
            return (
                <View
                    style={{
                        width: DesignConvert.swidth,
                        flex: 1,
                        flexDirection: 'row',
                        paddingLeft: DesignConvert.getW(10),
                        paddingRight: DesignConvert.getW(10),
                        flexWrap: 'wrap',
                    }}>
                    {this._searchList.map((value, index) => {
                        return (
                            <_TagItem
                                key={index}
                                onPress={this._onSearchTagPress}
                                tagText={value}></_TagItem>
                        );
                    })}
                </View>
            );
        } else {
            return (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        width: DesignConvert.swidth,
                        marginTop: DesignConvert.getH(10),
                        flex: 1,
                    }}>

                    <Text
                        style={{
                            width: DesignConvert.swidth,
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(15),
                            marginLeft: DesignConvert.getW(20),
                            marginTop: DesignConvert.getH(20),
                            fontWeight: 'bold',
                        }}>找用户</Text>

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        initialNumToRender={5}
                        data={this._userList}
                        renderItem={this._renderUserItem}
                        keyExtractor={this._keyUserExtractor}
                        ListEmptyComponent={this._renderEmptyViewUser}
                        onEndReached={this._roomLoadMore}
                        onEndReachedThreshold={0.2}
                        style={{
                            padding: DesignConvert.getW(10),
                            paddingLeft: DesignConvert.getW(20),
                            paddingRight: DesignConvert.getW(20),
                        }}></FlatList>

                    <View
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(15),
                            // backgroundColor: '#F4F5F6'
                        }}
                    />
                    <Text
                        style={{
                            width: DesignConvert.swidth,
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(15),
                            marginLeft: DesignConvert.getW(20),
                            marginTop: DesignConvert.getH(20),
                            fontWeight: 'bold',
                        }}>找房间</Text>

                    <FlatList
                        initialNumToRender={6}
                        data={this._roomList}
                        keyExtractor={this._keyRoomExtractor}
                        ListEmptyComponent={this._renderEmptyView}
                        onEndReached={this._loadMore}
                        onEndReachedThreshold={0.1}
                        renderItem={this._renderItem}
                        scrollEnabled={false}
                        style={{
                            width: DesignConvert.swidth,

                            paddingLeft: DesignConvert.getW(20),
                            paddingRight: DesignConvert.getW(20),
                            marginTop: DesignConvert.getH(10),
                        }}></FlatList>



                </ScrollView>
            );
        }
    };

    render() {
        return (
            <ImageBackground
                style={{
                    flex: 1,
                }}
                source={require('../../hardcode/skin_imgs/login').bg()}
            >


                <StatusBarView />

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(44),
                        marginTop: DesignConvert.getH(20),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // marginLeft: DesignConvert.getW(9),
                    }}>
                    <TouchableOpacity
                        style={{
                            height: DesignConvert.getH(44),
                            marginLeft: DesignConvert.getW(15),
                            justifyContent: 'center',
                        }}
                        onPress={this.props.onBack}
                    >
                        <Image
                            style={{
                                width: DesignConvert.getW(9),
                                height: DesignConvert.getH(15),
                                
                                marginEnd: DesignConvert.getW(15),

                                ... this.props.backImgStyle,
                            }}
                            source={require('../../hardcode/skin_imgs/lvdong').title_back_icon()}
                        />
                    </TouchableOpacity>
                    <View
                        style={{
                            width: DesignConvert.getW(265),
                            height: DesignConvert.getH(33),
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: DesignConvert.getW(0),
                            paddingRight: DesignConvert.getW(12),
                            backgroundColor: 'rgba(120, 120, 120, 0.41)',
                            borderRadius: DesignConvert.getW(19),
                            marginLeft: DesignConvert.getW(8)
                        }}>
                        <TouchableOpacity
                            onPress={this._onSearch}
                            style={{
                                width: DesignConvert.getW(50),
                                height: DesignConvert.getH(33),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >

                            <Image
                                source={require('../../hardcode/skin_imgs/search').home_search_ic()}
                                style={{
                                    width: DesignConvert.getW(17.5),
                                    height: DesignConvert.getH(18),
                                    resizeMode: 'contain',
                                    marginRight: DesignConvert.getW(0),
                                    tintColor: 'rgba(255, 255, 255, 0.4)'
                                }} />
                        </TouchableOpacity>

                        <TextInput
                            style={{
                                flex: 1,
                                color: 'rgba(255, 255, 255, 0.40)',
                                fontSize: DesignConvert.getF(12),
                                padding: 0,
                                // marginLeft: DesignConvert.getW(11),
                            }}
                            placeholder="搜索房间名称、用户昵称或ID"
                            value={this._searchKey}
                            keyboardType="default"
                            underlineColorAndroid="transparent"
                            placeholderTextColor="rgba(255, 255, 255, 0.40)"
                            returnKeyType="search"
                            onChangeText={this._onChangeSearchKey}
                            selectionColor="rgba(255, 255, 255, 0.40)"
                            onSubmitEditing={this._onSearch}
                            autoFocus={true}
                        ></TextInput>

                        <TouchableOpacity
                            onPress={this._onClosedPress}
                            style={{
                                width: DesignConvert.getW(16),
                                height: DesignConvert.getH(16),
                            }}>
                            <Image
                                style={{
                                    width: DesignConvert.getW(16),
                                    height: DesignConvert.getH(16),
                                }}
                                source={require('../../hardcode/skin_imgs/search').home_searchdelete_ic()}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={{ marginLeft: DesignConvert.getW(12) }}
                        onPress={this.popSelf}>
                        <Text style={{ fontSize: DesignConvert.getF(14), color: '#FFFFFF' }}>取消</Text>
                    </TouchableOpacity>

                    {/*<TouchableOpacity*/}
                    {/*    style={{*/}
                    {/*        position: 'absolute',*/}
                    {/*        left: DesignConvert.getW(20),*/}
                    {/*        top: DesignConvert.getH(12),*/}
                    {/*        minWidth: DesignConvert.getW(25),*/}
                    {/*    }}*/}
                    {/*    onPress={this._onBackPress}>*/}

                    {/*    <Image*/}
                    {/*        style={{*/}
                    {/*            width: DesignConvert.getW(11),*/}
                    {/*            height: DesignConvert.getH(21),*/}
                    {/*        }}*/}
                    {/*        source={ic_back_black()}*/}
                    {/*    />*/}
                    {/*</TouchableOpacity>*/}

                </View>
                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(1),
                        // backgroundColor: '#F0F0F0'
                    }}
                />
                {this._renderContent()}
            </ImageBackground >
        );
    }
}
