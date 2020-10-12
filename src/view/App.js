import React, { Fragment } from 'react';


import { TouchableOpacity, Text, ScrollView, View } from 'react-native';
import BaseView from './base/BaseView';

export default class App extends BaseView {
  render() {
    const StatusBarView = require("./base/StatusBarView").default;
    const style = {
      marginLeft: 10,
      marginTop: 10
    };

    return (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#C7EDCC'
          }}
        >
          <View>
            <StatusBarView />

            <TouchableOpacity
              style={style}
              onPress={() => {
                // require('../router/level1_router').showLoginView();
              }}
            >
              <Text>登陆界面</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style}
              onPress={() => {
                // require('../router/level1_router').showLoginView();
              }}
            >
              <Text>账号密码登陆</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style}
              onPress={() => {
                // require('../router/level1_router').showLoginView();
              }}
            >
              <Text>XXX界面</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style}
              onPress={() => {
                // require('../router/level1_router').showLoginView();
              }}
            >
              <Text>XXX界面</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      
      
    );
  }
}
