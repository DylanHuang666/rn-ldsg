'use strict';

import React, { PureComponent } from 'react';
import { View, Text, Image } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import { sex_female, sex_male } from "../../hardcode/skin_imgs/common";
import { ic_default_female, ic_default_male } from '../../hardcode/skin_imgs/registered';
import LinearGradient from 'react-native-linear-gradient';

export default class SexAgeWidget extends PureComponent {

    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={this.props.sex == 2 ? ['#FF6DC8', '#FF6DC8'] : ['#00BCFF', '#00BCFF']}
                style={[{
                    // backgroundColor: this.props.sex == 2 ? "#FF65B2" : "#3BACFF",
                    // width: DesignConvert.getW(39),
                    paddingHorizontal: DesignConvert.getW(4),
                    height: DesignConvert.getH(14),
                    borderRadius: DesignConvert.getW(9),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }, this.props.style]}>
                <Image
                    source={this.props.sex == 2 ? sex_female() : sex_male()}
                    style={{
                        width: DesignConvert.getW(6),
                        height: DesignConvert.getH(9.5),
                        resizeMode: 'contain',
                        tintColor: "white",
                    }}></Image>

                {this.props.age ? (
                    <Text
                        style={{
                            color: "white",
                            fontSize: DesignConvert.getF(11),
                            marginLeft: DesignConvert.getW(2),
                        }}
                    >
                        {`${this.props.age}`}
                    </Text>
                ) : null}

            </LinearGradient>
        )
    }
}