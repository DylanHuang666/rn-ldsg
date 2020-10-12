'use strict';

import React, { PureComponent } from "react";
import { Text } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";



export default class _PublicScreenMessageTipsItem extends PureComponent {

    render() {
        return (
            <Text
                style={{
                    marginBottom: DesignConvert.getH(10),

                    flexWrap: 'wrap',

                    maxWidth: DesignConvert.getW(256),
                    minWidth: DesignConvert.getW(100),

                    color: '#FFDA7E',
                    fontSize: DesignConvert.getF(11),

                    backgroundColor: '#FFFFFF40',
                    borderRadius: DesignConvert.getW(4),
                    padding: DesignConvert.getW(10),

                    includeFontPadding: false,
                }}

            >{this.props.data}</Text>

        )
    }
}
