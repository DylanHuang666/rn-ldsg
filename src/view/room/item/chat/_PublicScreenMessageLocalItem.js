'use strict';

import React, { PureComponent } from "react";
import { Text, View, Image } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import LinearGradient from "react-native-linear-gradient";



export default class _PublicScreenMessageLocalItem extends PureComponent {

    render() {
        return (
            <View
                style={{
                    marginBottom: DesignConvert.getH(10),

                    // maxWidth: DesignConvert.getW(256),
                    // minWidth: DesignConvert.getW(100),
                    // backgroundColor: '#FFFFFF19',
                    // borderRadius: DesignConvert.getW(4),
                    // padding: DesignConvert.getW(10),
                    // flexWrap: 'wrap',
                    // flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    // alignItems: 'center',

                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }}
            >

                <Text
                    style={{
                        marginLeft: DesignConvert.getW(33),

                        color: 'white',
                        fontSize: DesignConvert.getF(10),
                    }}
                >元气官方</Text>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#DDC0FF', '#AC85FF']}
                    style={{
                        marginLeft: DesignConvert.getW(33),
                        marginTop: DesignConvert.getH(4),

                        borderRadius: DesignConvert.getW(4),

                        // justifyContent: 'center',
                        // alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#39FFDA',

                            maxWidth: DesignConvert.getW(256),

                            fontSize: DesignConvert.getF(12),
                            includeFontPadding: false,

                            flexWrap: 'wrap',

                            margin: DesignConvert.getW(9),
                        }}
                    >{this.props.data}</Text>
                </LinearGradient>

                {/* <View
                    style={{
                        marginLeft: DesignConvert.getW(33),
                        marginTop: DesignConvert.getH(4),

                        backgroundColor: '#FFFFFF19',
                        borderRadius: DesignConvert.getW(4),

                        // justifyContent: 'center',
                        // alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#39FFDA',

                            maxWidth: DesignConvert.getW(256),

                            fontSize: DesignConvert.getF(12),
                            includeFontPadding: false,

                            flexWrap: 'wrap',

                            margin: DesignConvert.getW(9),
                        }}
                    >{this.props.data}</Text>
                </View> */}

                <Image
                    style={{
                        position: 'absolute',
                        width: DesignConvert.getW(27),
                        height: DesignConvert.getH(27),
                    }}
                    source={require("../../../../hardcode/skin_imgs/common").ic_logo_circle()}
                />

            </View>

        )
    }
}
