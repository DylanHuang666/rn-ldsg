/**
 * 房间->礼物面板Item项
 */
'use strict';

import React, { PureComponent, Component } from "react";
import { View, Image, ImageBackground, Text, TouchableOpacity, Clipboard, ScrollView, Platform } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../utils/DesignConvert";

export function LinearBtn(props) {

  const { onPress, sty, txt, txtSty, linear } = props

  return (
    <TouchableOpacity
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        ...sty
      }}
      onPress={onPress}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={linear}
        style={{

          ...sty,
          position: 'absolute',
          left: 0,
          top: 0
        }}
      />
      <Text
        style={txtSty}
      >{txt}</Text>
    </TouchableOpacity>
  )

}