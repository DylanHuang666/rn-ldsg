/**
 * 直播间 -> 心动值
 */
'use strict';

import React, { PureComponent } from "react";
import { Image, Text, View } from "react-native";
import { ic_beckoning } from "../../../hardcode/skin_imgs/room";
import DesignConvert from "../../../utils/DesignConvert";

export default class _BeckoningItem extends PureComponent {

    render() {
        const bMale = this.props.bMale;
        const num = this.props.num;

        return (
            <View
                style={{
                    height: DesignConvert.getH(20),

                    ...this.props.style
                }}
            >

                <View
                    style={{
                        marginTop: DesignConvert.getH(3),
                        marginLeft: DesignConvert.getW(10),

                        height: DesignConvert.getH(16),

                        borderTopLeftRadius: DesignConvert.getH(11),
                        borderTopRightRadius: DesignConvert.getH(11),
                        borderBottomRightRadius: DesignConvert.getH(11),

                        backgroundColor: '#FF366B',

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            marginLeft: DesignConvert.getW(13),
                            marginRight: DesignConvert.getW(4),

                            fontSize: DesignConvert.getF(10),
                            color: 'white',
                        }}
                    >{num}</Text>
                </View>

                <Image
                    style={{
                        position: 'absolute',

                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(20),
                        resizeMode: 'contain',
                    }}
                    source={ic_beckoning()}
                />

            </View>
        )


        // return (
        //     <LinearGradient
        //         start={{ x: 0, y: 0 }}
        //         end={{ x: 0, y: 1 }}
        //         colors={['#FFEDBC', '#FF6E7F']}
        //         style={[{
        //             flexDirection: 'row',
        //             justifyContent: 'center',
        //             alignItems: 'center',
        //             borderRadius: DesignConvert.getW(8),
        //             height: DesignConvert.getH(14),
        //             minWidth: DesignConvert.getW(31),
        //             paddingHorizontal: DesignConvert.getW(4),
        //         }, this.props.style]}
        //     >
        //         <Image
        //             style={{
        //                 width: DesignConvert.getW(10),
        //                 height: DesignConvert.getH(9),
        //                 resizeMode: 'contain',
        //             }}
        //             source={ic_beckoning()}
        //         />

        //         <Text
        //             style={{
        //                 marginLeft: DesignConvert.getW(2),
        //                 fontSize: DesignConvert.getF(10),
        //                 color: 'white',
        //             }}
        //         >{num}</Text>
        //     </LinearGradient>
        // );
    }
}