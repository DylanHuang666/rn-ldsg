/**
 * 首次登陆设置密码页面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import LinearGradient from "react-native-linear-gradient";
import DesignConvert from "../../utils/DesignConvert";
import BaseView from "../base/BaseView";
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ImageBackground, TextInput } from "react-native";
import { SubmitButton } from "../anchorincome/VerifyPayPasswordView";
import BackTitleView from "../base/BackTitleView";
import ToastUtil from "../base/ToastUtil";

export default class SetPasswordView extends BaseView {

  constructor(props) {
    super(props)
    this._passWord = "";
    this._passWordAgain = "";


  }

  _changepsw = s => {
    this._passWord = s
    this.forceUpdate()
  }

  _changepswAgain = s => {
    this._passWordAgain = s
    this.forceUpdate()
  }

  _onSubmitPress = () => {

    if (this._passWord.length < 6 || this._passWord.length > 16) {
      return ToastUtil.showCenter("请输入6-16的密码长度");
    }

    if (this._passWord != this._passWordAgain) {
      ToastUtil.showCenter("密码不一致");
      return
    }
    require("../../model/setting/UpdatePasswordModel").default.fitstUpdatePasswor(this._passWord)
      .then(data => {
        if (data) {
          ToastUtil.showCenter("修改成功");
          require("../../router/level1_router").showMainRootView();
          // this.popSelf();
        }
      })


  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffff',

          alignItems: 'center'
        }}
      >
        <BackTitleView
          onBack={this.popSelf}
          titleText="设置密码"
        />


        <View
          style={{
            width: DesignConvert.swidth,
            height: DesignConvert.getH(1),

            backgroundColor: '#F0F0F0'
          }}
        />
        <TextInput
          style={{
            width: DesignConvert.swidth - DesignConvert.getW(34),

            marginTop: DesignConvert.getH(200),
            marginHorizontal: DesignConvert.getW(17),

            fontSize: DesignConvert.getF(15),
            lineHeight: DesignConvert.getH(21),

            paddingBottom: DesignConvert.getH(10),

            borderBottomWidth: DesignConvert.getH(1),
            borderBottomColor: '#F0F0F0FF',
            color: '#999999FF',
          }}
          placeholder="请输入你设置的密码"
          placeholderTextColor='#999999FF'
          value={this._passWord}
          keyboardType="default"
          placeholderTextColor="#999999"
          returnKeyType='next'
          onChangeText={this._changepsw}
          maxLength={16}
          selectionColor='#25DCB0FF'
        />
        <TextInput
          style={{
            width: DesignConvert.swidth - DesignConvert.getW(34),

            marginTop: DesignConvert.getH(20),
            marginHorizontal: DesignConvert.getW(17),

            fontSize: DesignConvert.getF(15),
            lineHeight: DesignConvert.getH(21),

            paddingBottom: DesignConvert.getH(10),

            borderBottomWidth: DesignConvert.getH(1),
            borderBottomColor: '#F0F0F0FF',
            color: '#999999FF',
          }}
          // secureTextEntry
          placeholder="再次确认你的密码"
          placeholderTextColor='#999999FF'
          value={this._passWordAgain}
          keyboardType="default"
          placeholderTextColor="#999999"
          returnKeyType='next'
          onChangeText={this._changepswAgain}
          maxLength={16}
          selectionColor='#25DCB0FF'
        />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['#494F5CFF', '#191919FF']}
          style={{
            position: 'absolute',
            top: DesignConvert.getH(400),
            marginTop: DesignConvert.getH(20),
            width: DesignConvert.getW(280),
            height: DesignConvert.getH(44),
            borderRadius: DesignConvert.getW(5),
          }}>

          <TouchableOpacity
            onPress={this._onSubmitPress}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <Text
              style={{
                fontSize: DesignConvert.getF(15),
                color: '#FFFFFFFF',
                textAlign: 'center',
              }}
            >确定</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }

}