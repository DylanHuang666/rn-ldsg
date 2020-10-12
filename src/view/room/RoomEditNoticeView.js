/**
 * 房间公告编辑界面
 */

'use strict';

import React from 'react';
import BaseView from "../base/BaseView";
import { View, Image, Text, TouchableOpacity, TextInput, findNodeHandle, Platform, Keyboard, ImageBackground, KeyboardAvoidingView } from "react-native";
import DesignConvert from '../../utils/DesignConvert';
import { ic_closed } from '../../hardcode/skin_imgs/mywallet';
import RoomInfoCache from '../../cache/RoomInfoCache';
import RoomModel from '../../model/room/RoomModel';
import { BlurView } from 'react-native-blur'
import LinearGradient from 'react-native-linear-gradient';
import Config from '../../configs/Config';
import { THEME_COLOR } from '../../styles';
import KeyboardAvoidingViewExt from '../base/KeyboardAvoidingViewExt';
import ToastUtil from '../base/ToastUtil';


export default class RoomEditNoticeView extends BaseView {

  constructor(props) {
    super(props);

    this._notice = RoomInfoCache.roomData ? (RoomInfoCache.roomData.notic == '' ? '喜欢的小伙伴点个关注吧~' : RoomInfoCache.roomData.notic) : '喜欢的小伙伴点个关注吧~';

    this._viewRef = Platform.OS === 'ios' && RoomModel.getBgRef() && findNodeHandle(RoomModel.getBgRef());
    this._marginTop = this._notice.length;

    this.state = {
      count: this._notice.length
    }

    this._isEditStatus = false//是否是编辑模式
  }

  _onChangeText = s => {
    this._notice = s;
    this.state.count = s.length
    this.forceUpdate();
  }

  componentDidMount() {
    super.componentDidMount();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    if (Platform.OS == 'ios') {
      this._marginTop = DesignConvert.getH(50);
      this.forceUpdate();
    }
  }

  _keyboardDidHide = () => {
    //软键盘隐藏
    if (Platform.OS == 'ios') {
      this._marginTop = 0;
      this.forceUpdate();
    }

  }

  _onPublish = () => {
    if (!this._notice) {
      ToastUtil.showCenter('输入内容不能为空！')
      return;
    }
    this.popSelf();
    require('../../model/room/RoomModel').modifyNotice(this._notice);
  }

  _switchToEdit = () => {
    this._isEditStatus = true
    this.forceUpdate()
  }

  render() {

    return (
      <KeyboardAvoidingViewExt
        behavior='height'
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >

        <TouchableOpacity
          style={{
            width: DesignConvert.swidth,
            height: DesignConvert.sheight,
            flex: 1,
          }}
        // onPress={this.popSelf}
        >

        </TouchableOpacity>

        <View
          style={{
            position: 'absolute',
            top: DesignConvert.getH(428) + DesignConvert.statusBarHeight,
            right: DesignConvert.getW(15),

            width: DesignConvert.getW(180),
            height: DesignConvert.getH(121),
            borderRadius: DesignConvert.getW(8),
            backgroundColor: 'rgba(0, 0, 0, 0.9)',

            padding: DesignConvert.getW(10)
          }}
        >
          {/* <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >

                        <Text
                            style={{
                                color: '#1D1D1D',
                                fontSize: DesignConvert.getF(16),
                                marginTop: DesignConvert.getH(15),
                            }}
                        >房间公告</Text>

                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                left: 0,
                                height: DesignConvert.getH(44),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={this.popSelf}
                        >
                            <Image
                                source={
                                    require('../../hardcode/skin_imgs/common').ic_back_black()
                                }
                                style={{
                                    width: DesignConvert.getW(12),
                                    height: DesignConvert.getH(21),
                                    marginLeft: DesignConvert.getW(14),
                                    marginEnd: DesignConvert.getW(14)
                                }}
                            />
                        </TouchableOpacity>

                    </View> */}

          <TextInput
            style={{
              flex: 1,
              fontSize: DesignConvert.getF(12),

              lineHeight: DesignConvert.getH(18),
              textAlignVertical: 'top',


              color: '#FFFFFF',
              padding: DesignConvert.getW(0),
            }}
            editable={this._isEditStatus}
            multiline={true}
            maxLength={200}
            defaultValue={this._notice}
            underlineColorAndroid="transparent"
            placeholder='输入公告'
            placeholderTextColor='#B7B7B7'
            onChangeText={this._onChangeText}
            selectionColor={THEME_COLOR}
          >

          </TextInput>

          {/* {this._isEditStatus &&
                        <Text
                            style={{
                                position: 'absolute',
                                right: DesignConvert.getW(17),
                                bottom: DesignConvert.getH(56),
                                color: '#C8C8C8',
                                fontSize: DesignConvert.getF(13),
                            }}
                        >

                            <Text
                                style={{
                                    color: '#444444',
                                    fontSize: DesignConvert.getF(13),
                                }}
                            >
                                {this.state.count}
                            </Text>

                            {`/200`}</Text>
                    } */}

          <View
            style={{

              width: DesignConvert.getW(120),
              height: DesignConvert.getH(44),

              marginTop: DesignConvert.getH(10),

              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',

              alignSelf: 'center',
            }}
          >


            <TouchableOpacity
              style={{
                width: DesignConvert.getW(47),
                height: DesignConvert.getH(24),
                borderRadius: DesignConvert.getW(16),

                justifyContent: 'center',
                alignItems: 'center',

              }}
              onPress={this.popSelf}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#F6F6F6', '#C6C6C6']}
                style={{
                  position: 'absolute',

                  width: DesignConvert.getW(47),
                  height: DesignConvert.getH(24),
                  borderRadius: DesignConvert.getW(16),
                }}
              />


              <Text
                style={{
                  color: '#787878',
                  fontSize: DesignConvert.getF(11),
                }}
              >关闭
                        </Text>

            </TouchableOpacity>

            {!this._isEditStatus &&
              <TouchableOpacity
                style={{
                  width: DesignConvert.getW(47),
                  height: DesignConvert.getH(24),
                  borderRadius: DesignConvert.getW(16),

                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={this._switchToEdit}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={['#FF5245', '#CD0031']}
                  style={{
                    position: 'absolute',

                    width: DesignConvert.getW(47),
                    height: DesignConvert.getH(24),
                    borderRadius: DesignConvert.getW(16),
                  }}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: DesignConvert.getF(11),
                  }}
                >编辑</Text>

              </TouchableOpacity>
            }

            {this._isEditStatus &&
              <TouchableOpacity
                style={{
                  width: DesignConvert.getW(47),
                  height: DesignConvert.getH(24),
                  borderRadius: DesignConvert.getW(16),

                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={this._onPublish}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={['#FF5245', '#CD0031']}
                  style={{
                    position: 'absolute',

                    width: DesignConvert.getW(47),
                    height: DesignConvert.getH(24),
                    borderRadius: DesignConvert.getW(16),
                  }}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: DesignConvert.getF(11),
                  }}
                >完成
                        </Text>

              </TouchableOpacity>
            }
          </View>
        </View>
      </KeyboardAvoidingViewExt>
    );

    return (
      <View
        style={{
          width: DesignConvert.swidth,
          height: DesignConvert.sheight,
          backgroundColor: "rgba(0,0,0,0)",
          flexDirection: "row",
          marginTop: this._marginTop,
        }}
      >

        <TouchableOpacity
          onPress={this.popSelf}
          style={{
            width: DesignConvert.getW(117),
            height: DesignConvert.sheight,
          }}
        />

        <View style={{
          width: DesignConvert.getW(258),
          height: DesignConvert.sheight,
          backgroundColor: "#00000066",
        }}>

          {RoomModel.getBgRef() && Platform.OS === 'ios' ?
            <BlurView
              blurType='dark'
              blurAmount={5}
              viewRef={this._viewRef}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                right: 0,
                overflow: 'hidden',
              }}
            />
            : null
          }

          <View
            style={{
              width: DesignConvert.getW(258),
              marginTop: DesignConvert.getH(40),
              marginBottom: DesignConvert.getH(18),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: DesignConvert.getF(16),
              }}
            >
              {'公告'}
            </Text>

            <TouchableOpacity
              onPress={this._onPublish}
              style={{
                position: 'absolute',
                right: DesignConvert.getW(18),
                top: DesignConvert.getH(1),
              }}
            >
              <Text
                style={{
                  color: "#CFBAFF",
                  fontSize: DesignConvert.getF(12),
                }}
              >
                {'发布'}
              </Text>
            </TouchableOpacity>

          </View>

          <View
            style={{
              width: DesignConvert.getW(258),
              height: DesignConvert.getH(0.5),
              backgroundColor: '#F2F2F2',
              opacity: 0.4,
              marginBottom: DesignConvert.getH(20),
            }}
          />

          <TextInput
            style={{
              marginLeft: DesignConvert.getW(19),
              width: DesignConvert.getW(220),
              fontSize: DesignConvert.getF(12),
              lineHeight: DesignConvert.getH(18),
              textAlignVertical: 'top',
              color: '#FFFFFF',
              height: DesignConvert.getH(360),
            }}
            multiline={true}
            maxLength={200}
            defaultValue={this._notice}
            underlineColorAndroid="transparent"
            placeholder="输入有趣的话题，可以提高活跃度哦~"
            placeholderTextColor="#CCCCCC"
            onChangeText={this._onChangeText}
          />
        </View>
      </View>
    );
  }
}