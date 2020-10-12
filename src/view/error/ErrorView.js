/**
 * 全局错误信息提示框
 */
'use strict';

import React, {Component} from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Platform,
	Image,
	FlatList,
	ScrollView,
	Clipboard,
} from 'react-native';
// import RNFS from 'react-native-fs';
import BaseView from '../base/BaseView';
import DesignConvert from '../../utils/DesignConvert';


async function _saveLog(s) {
	// let rootFolder = null;
	// switch (Platform.OS) {
	// 	case 'android':
	// 		rootFolder = RNFS.ExternalDirectoryPath;
	// 		break;

	// 	case 'ios':
	// 		rootFolder  = RNFS.DocumentDirectoryPath;
	// 		break;

	// 	default:
	// 		return;
	// }

	// const folder = Conf.joinPath(rootFolder, 'logs/stack');
	// try {
	// 	const b = await RNFS.exists(folder);
	// 	if (!b) {
	// 		await RNFS.mkdir(folder);
	// 	}

	// 	const savePath = Conf.joinPath(folder, Date.now() + '.txt');
	// 	RNFS.writeFile(savePath, s);
	// 	// console.warn(savePath)
	// } catch (stack) {
	// 	console.warn(stack);
	// }

}

export default class ErrorView extends BaseView {

	render() {
		return (
			<View style={{
				backgroundColor: 'skyblue',
				flex: Platform.select({
					android: 1,
				}),
				width: Platform.select({
					ios: DesignConvert.swidth,
				}),
				height: Platform.select({
					ios: DesignConvert.sheight,
				}),

				// flexDirection: 'column',
				// justifyContent: 'flex-start',
				alignItems: 'center',
			}}>
				<Text
					style={{
						color: 'red',
						fontSize: DesignConvert.getF(20),
					}}
				>错误信息（帮忙记录）</Text>
				<ScrollView
					style={{
						width: DesignConvert.swidth,
						// height: DesignConvert.sheight * 0.5,
					}}
				>
					<Text
						style={{
							width: DesignConvert.swidth,
						}}
					>{this.props.params.message + '\n\n堆栈信息:\n' + this.props.params.stack}</Text>
				</ScrollView>

				<View
					style={{
						width: DesignConvert.swidth,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>

					<TouchableOpacity
						onPress={this.popSelf}
					>
						<Text
							style={{
								color: 'blue',
								fontSize: DesignConvert.getF(20),
							}}
						>关闭</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={()=>{
							Clipboard.setString(this.props.params.message + '\n\n堆栈信息:\n' + this.props.params.stack);
						}}
					>
						<Text
							style={{
								color: 'blue',
								fontSize: DesignConvert.getF(20),
							}}
						>复制</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={()=>{
							_saveLog(this.props.params.message + '\n\n堆栈信息:\n' + this.props.params.stack);
						}}
					>
						<Text
							style={{
								color: 'blue',
								fontSize: DesignConvert.getF(20),
							}}
						>保存日志</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}