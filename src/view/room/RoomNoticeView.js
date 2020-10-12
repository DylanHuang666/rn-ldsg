/**
 * 房间公告界面
 */

'use strict';

import React from 'react';
import BaseView from "../base/BaseView";
import { Text, TouchableOpacity, ImageBackground, View, ScrollView } from "react-native";
import DesignConvert from '../../utils/DesignConvert';
import RoomInfoCache from '../../cache/RoomInfoCache';
import { THEME_COLOR } from '../../styles';

export default class RoomNoticeView extends BaseView {

  constructor(props) {
    super(props)

    // this._viewRef = Platform.OS === 'ios' && RoomModel.getBgRef() && findNodeHandle(RoomModel.getBgRef());
  }


  render() {

    const txt = RoomInfoCache.roomData ? (RoomInfoCache.roomData.notic == '' ? '喜欢的小伙伴点个关注吧~' : RoomInfoCache.roomData.notic) : '喜欢的小伙伴点个关注吧~';


    return (
      <View
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
          onPress={this.popSelf}
        />

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
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: '#1D1D1D',
                                fontSize: DesignConvert.getF(16),
                            }}
                        >房间公告</Text>
                    </View> */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              // marginTop: DesignConvert.getH(11),
              // marginBottom: DesignConvert.getH(44),
            }}>
            <Text
              style={{
                flexWrap: 'wrap',
                color: '#ffffff',
                fontSize: DesignConvert.getF(12),

                // marginStart: DesignConvert.getW(17.5),
                // marginEnd: DesignConvert.getW(17.5),
              }}
            >{txt}</Text>
          </ScrollView>
          {/* <View
            style={{
              position: 'absolute',
              top: 0,

              width: DesignConvert.getW(180),
              height: DesignConvert.getH(0.5),

              backgroundColor: '#F0F0F0'
            }}
          /> */}
          <TouchableOpacity
            style={{
              marginVertical: DesignConvert.getH(15),
              alignSelf: 'center',

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
            >关闭</Text>

          </TouchableOpacity>

        </View>

      </View>
    )


    // return (
    //     <View
    //         style={{
    //             flex: 1,
    //             width: DesignConvert.swidth,
    //             backgroundColor: "rgba(0,0,0,0)",
    //             flexDirection: "row",
    //         }}
    //     >

    //         <TouchableOpacity
    //             onPress={this.popSelf}
    //             style={{
    //                 width: DesignConvert.getW(117),
    //                 height: DesignConvert.sheight,
    //             }}
    //         />

    //         <View style={{
    //             width: DesignConvert.getW(258),
    //             height: DesignConvert.sheight,
    //             backgroundColor: "#00000066",
    //         }}>

    //             {RoomModel.getBgRef() && Platform.OS === 'ios' ?
    //                 <BlurView
    //                     blurType='dark'
    //                     blurAmount={5}
    //                     viewRef={this._viewRef}
    //                     style={{
    //                         width: '100%',
    //                         height: '100%',
    //                         position: 'absolute',
    //                         top: 0,
    //                         right: 0,
    //                         overflow: 'hidden',
    //                     }}
    //                 />
    //                 : null
    //             }

    //             <View
    //                 style={{
    //                     width: DesignConvert.getW(258),
    //                     marginTop: DesignConvert.getH(40),
    //                     marginBottom: DesignConvert.getH(18),
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                 }}
    //             >
    //                 <Text
    //                     style={{
    //                         color: "#FFFFFF",
    //                         fontSize: DesignConvert.getF(16),
    //                     }}
    //                 >
    //                     {'公告'}
    //                 </Text>
    //             </View>

    //             <View
    //                 style={{
    //                     width: DesignConvert.getW(258),
    //                     height: DesignConvert.getH(0.5),
    //                     backgroundColor: '#F2F2F2',
    //                     opacity: 0.4,
    //                     marginBottom: DesignConvert.getH(20),
    //                 }}
    //             />

    //             <Text
    //                 style={{
    //                     marginStart: DesignConvert.getW(18),
    //                     marginEnd: DesignConvert.getW(18),
    //                     flexWrap: 'wrap',
    //                     color: '#ffffff',
    //                     fontSize: DesignConvert.getF(12),
    //                 }}
    //             >{txt}</Text>
    //         </View>
    //     </View>
    // );
  }
}