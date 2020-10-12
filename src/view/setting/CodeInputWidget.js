'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
} from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import { THEME_COLOR } from "../../styles";

const numReg = /^[0-9]*$/;

function isNumber(str) {
    if (!str) return false;
    return numReg.test(str);
}


export default class CodeInputWidget extends PureComponent {

    constructor(props) {
        super(props);
    
        this._text = '';
    }


    // componentDidMount(){
    //     this._timer = setTimeout(()=>{
    //         this._inputRef && this._inputRef.focus();
    //     },500);
    // }

    // componentWillUnmount() {
    //     clearTimeout(this._timer);
    //     this._timer = null;
    // }

    setInput() {
        this._text = '';
        this.forceUpdate();
    }

    render() {
        return (
            <View
                style={[
                    {
                        flexDirection: 'row',
                        alignItems:'center',
                        justifyContent:'center',
                    },
                    this.props.style
                ]}
            >
                <View
                    style={{
                        width: DesignConvert.getW(37),
                        height: DesignConvert.getH(44),
                        borderRadius: DesignConvert.getW(10),
                        backgroundColor: '#FFFFFF',
                        marginHorizontal: DesignConvert.getW(7.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    
                    {this._text.charAt(0) ? 
                        <View 
                            style={{
                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(11),
                                borderRadius: DesignConvert.getW(6),
                                backgroundColor: '#212121',
                            }}
                        />
                        : 
                        (this._isFocus ? 
                            <View
                                style={{
                                    width: DesignConvert.getW(2),
                                    height: DesignConvert.getH(20),
                                    backgroundColor: THEME_COLOR,
                                    borderRadius: DesignConvert.getW(2),
                                }}
                            />
                            : null    
                        )
                    }
                </View>

                <View
                    style={{
                        width: DesignConvert.getW(37),
                        height: DesignConvert.getH(44),
                        borderRadius: DesignConvert.getW(10),
                        backgroundColor: '#FFFFFF',
                        marginHorizontal: DesignConvert.getW(7.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    
                    {this._text.charAt(1) ? 
                        <View 
                            style={{
                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(11),
                                borderRadius: DesignConvert.getW(6),
                                backgroundColor: '#212121',
                            }}
                        />
                        : 
                        (this._isFocus && this._text.length == 1 ? 
                            <View
                                style={{
                                    width: DesignConvert.getW(2),
                                    height: DesignConvert.getH(20),
                                    backgroundColor: THEME_COLOR,
                                    borderRadius: DesignConvert.getW(2),
                                }}
                            />
                            : null    
                        )
                    }
                </View>

                <View
                    style={{
                        width: DesignConvert.getW(37),
                        height: DesignConvert.getH(44),
                        borderRadius: DesignConvert.getW(10),
                        backgroundColor: '#FFFFFF',
                        marginHorizontal: DesignConvert.getW(7.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    
                    {this._text.charAt(2) ? 
                        <View 
                            style={{
                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(11),
                                borderRadius: DesignConvert.getW(6),
                                backgroundColor: '#212121',
                            }}
                        />
                        : 
                        (this._isFocus && this._text.length == 2 ? 
                            <View
                                style={{
                                    width: DesignConvert.getW(2),
                                    height: DesignConvert.getH(20),
                                    backgroundColor: THEME_COLOR,
                                    borderRadius: DesignConvert.getW(2),
                                }}
                            />
                            : null    
                        )
                    }
                </View>

                <View
                    style={{
                        width: DesignConvert.getW(37),
                        height: DesignConvert.getH(44),
                        borderRadius: DesignConvert.getW(10),
                        backgroundColor: '#FFFFFF',
                        marginHorizontal: DesignConvert.getW(7.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    
                    {this._text.charAt(3) ? 
                        <View 
                            style={{
                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(11),
                                borderRadius: DesignConvert.getW(6),
                                backgroundColor: '#212121',
                            }}
                        />
                        : 
                        (this._isFocus && this._text.length == 3 ? 
                            <View
                                style={{
                                    width: DesignConvert.getW(2),
                                    height: DesignConvert.getH(20),
                                    backgroundColor: THEME_COLOR,
                                    borderRadius: DesignConvert.getW(2),
                                }}
                            />
                            : null    
                        )
                    }
                </View>

                <View
                    style={{
                        width: DesignConvert.getW(37),
                        height: DesignConvert.getH(44),
                        borderRadius: DesignConvert.getW(10),
                        backgroundColor: '#FFFFFF',
                        marginHorizontal: DesignConvert.getW(7.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    
                    {this._text.charAt(4) ? 
                        <View 
                            style={{
                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(11),
                                borderRadius: DesignConvert.getW(6),
                                backgroundColor: '#212121',
                            }}
                        />
                        : 
                        (this._isFocus && this._text.length == 4 ? 
                            <View
                                style={{
                                    width: DesignConvert.getW(2),
                                    height: DesignConvert.getH(20),
                                    backgroundColor: THEME_COLOR,
                                    borderRadius: DesignConvert.getW(2),
                                }}
                            />
                            : null    
                        )
                    }
                </View>

                <View
                    style={{
                        width: DesignConvert.getW(37),
                        height: DesignConvert.getH(44),
                        borderRadius: DesignConvert.getW(10),
                        backgroundColor: '#FFFFFF',
                        marginHorizontal: DesignConvert.getW(7.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    
                    {this._text.charAt(5) ? 
                        <View 
                            style={{
                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(11),
                                borderRadius: DesignConvert.getW(6),
                                backgroundColor: '#212121',
                            }}
                        />
                        : 
                        (this._isFocus && this._text.length == 5 ? 
                            <View
                                style={{
                                    width: DesignConvert.getW(2),
                                    height: DesignConvert.getH(20),
                                    backgroundColor: THEME_COLOR,
                                    borderRadius: DesignConvert.getW(2),
                                }}
                            />
                            : null    
                        )
                    }
                </View>

                <TextInput 
                    ref={ref=>this._inputRef=ref}
                    maxLength={6}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: DesignConvert.getW(327),
                        height: DesignConvert.getH(44),
                        color: '#f1f1f1',
                        fontSize: DesignConvert.getF(1),
                    }}
                    keyboardType={'numeric'}
                    underlineColorAndroid="transparent"
                    caretHidden={true}
                    onFocus={()=>{
                        this._isFocus = true;
                        this.forceUpdate();
                    }}
                    onBlur={()=>{
                        this._isFocus = false;
                        this.forceUpdate();
                    }}
                    // autoFocus={true}
                    value={this._text}
                    selection = {{start: this._text.length, end: this._text.length}}
                    onChangeText={str => {
                        if (str && !isNumber(str.substr(-1))) return;
                        this._text = str;
                        this.props.codeChange && this.props.codeChange(this._text);
                        this.forceUpdate();
                        // if (this._text.length == 4) {
                        //     this._inputRef && this._inputRef.blur();
                        //     // ios 自动填充验证码会回调多次 onChangeText ??? 
                        //     this.props.fillCodeSuc && this.props.fillCodeSuc(this._text);
                        // } else {
                        //     this.props.fnUnFill && this.props.fnUnFill();
                        // }
                    }}
                />

            </View>
        )
    }
}