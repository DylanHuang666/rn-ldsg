/**
 * Created by shine on 2018/1/4.
 */
'use strict';

import React, {PropTypes, PureComponent,} from 'react'
import {
    requireNativeComponent,
    View,
    UIManager,
    DeviceEventEmitter
} from 'react-native';


//const FLASH_VIEW_REF = 'FlashViewRef';



class FlashView extends PureComponent {

    constructor(props) {
        super(props);
    }

    setNativeProps(props) {
        this._ref && this._ref.setNativeProps(props);
    }



    _onEnded(event){
        if(!this.props.onEnded){
            return;
        }
        this.props.onEnded(event.nativeEvent);
    }

    _onStarted(event){
        if(!this.props.onStarted){
            return;
        }
        this.props.onStarted(event.nativeEvent);
    }

    _onLoopEnded(event){
        if(!this.props.onLoopEnded){
            return;
        }
        this.props.onLoopEnded(event.nativeEvent);
    }

    _onFlashEvent(event){
        if(!this.props.onFlashEvent){
            return;
        }
        this.props.onFlashEvent(event.nativeEvent);
    }


	// reload(flashName, flashDir, designDPI){
	//    UIManager.dispatchViewManagerCommand(
 //            findNodeHandle(this.refs[FLASH_VIEW_REF]),
 //            UIManager.FlashView.Commands.reload,
 //            [flashName, flashDir, designDPI]
 //        );
	// }

	// play(animName, loopTimes, fromIndex, toIndex){
	//    UIManager.dispatchViewManagerCommand(
 //            findNodeHandle(this.refs[FLASH_VIEW_REF]),
 //            UIManager.FlashView.Commands.play,
 //            [animName, loopTimes, fromIndex, toIndex]
 //        );
	// }



	 render() {
        let allAnims;
        let flashFiles;
        if(Array.isArray(this.props.flashFileName)){
            flashFiles = this.props.flashFileName;
        }else{
            flashFiles = [this.props.flashFileName];
        }
        if(!this.props.defaultAnim){
            allAnims = flashFiles;
        }else{
            if(Array.isArray(this.props.defaultAnim)){
                allAnims = this.props.defaultAnim;
            }else{
                allAnims = [this.props.defaultAnim];
            }
        }
        let extraMap;
        if(typeof this.props.extraData === "object"){
            extraMap = this.props.extraData;
        }else{
            extraMap = {data:this.props.extraData};
        }
        const nativeProps = {...this.props};
        // if(nativeProps.hasOwnProperty("url") && !nativeProps["url"]){
        //     delete nativeProps["url"];
        // }
        nativeProps.flashFiles = flashFiles;
        nativeProps.allAnims = allAnims;
        nativeProps.extraMap = extraMap;
        return(
            <RCTFlashView
                ref={(ref)=>this._ref = ref}
                {...nativeProps}
                onEnded={this._onEnded.bind(this)}
                onStarted={this._onStarted.bind(this)}
                onLoopEnded={this._onLoopEnded.bind(this)}
                onFlashEvent={this._onFlashEvent.bind(this)}
            />
        );
    };
}


// let flashView = {
//     name: 'FlashView',
//     propTypes: {
//         onEnded: PropTypes.func,        //动画播放结束回调
//         onStarted: PropTypes.func,      //动画开始播放回调
//         onLoopEnded: PropTypes.func,    //动画循环次数结束回调
//         onFlashEvent: PropTypes.func,   //flash事件回调
//         stopWith: PropTypes.number,     //停到某一帧，传入参数 取值范围[0, n)
//         flashDir: PropTypes.string,
//         extraScale: PropTypes.arrayOf(PropTypes.object),
//         flashFileName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
//         flashFiles: PropTypes.arrayOf(PropTypes.string),
//         loopTimes: PropTypes.number,
//         fromIndex: PropTypes.number,    //取值范围[0, n)
//         toIndex: PropTypes.number,      //取值范围[0, n)
//         replaceTexture:PropTypes.arrayOf(PropTypes.object), // 修改帧图片数据，eg:[{anim:"xxx", from:x, to:x, oldTex:"xxx.png", newTex:"xxx.png"}, ...], 
//                                         //  @amin: 动画名字
//                                         //  @from: 第几帧开始，取值范围[0, n)
//                                         //  @to: 到几帧结束，取值范围[0, n)
//                                         //  @oldTex: 旧图片名字
//                                         //  @newTex: 新图片名字
//         url: PropTypes.string,
//         extraMap:PropTypes.object,
//         extraData:PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number, PropTypes.bool]),
//         defaultAnim: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
//         allAnims: PropTypes.arrayOf(PropTypes.string),
//         ...View.propTypes
//     },
// };

// var cfg = {
//   nativeOnly: {
//     allAnims: true,
//     flashFiles: true,
//     extraMap: true,
//   },
// };


//let RCTFlashView = requireNativeComponent('RCTFlashView', flashView, cfg);
let RCTFlashView = requireNativeComponent('RCTFlashView');

module.exports = FlashView;