/**
 * 主题背景
 */
'use strict';

import React from "react";
import { Image } from 'react-native';
import DesignConvert from "../../utils/DesignConvert";

export default function ThemeBgc() {

  return (
    <Image
      source={require('../../hardcode/skin_imgs/main').theme_bg()}
      style={{
        position: 'absolute',

        width: DesignConvert.swidth,
        height: DesignConvert.sheight,
      }}
    />
  )
}