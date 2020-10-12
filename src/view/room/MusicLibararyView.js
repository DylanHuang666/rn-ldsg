import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, TextInput, ActivityIndicator } from "react-native";
import BaseView from "../base/BaseView";
import DesignConvert from "../../utils/DesignConvert";
import { ImgTouchableOpacity } from './RoomMusicPlayView'
import UserInfoCache from "../../cache/UserInfoCache";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_UPDATE_ROOM_MUSIC_LIST } from "../../hardcode/HGlobalEvent";

export default class MusicLibararyView extends BaseView {
  constructor(props) {
    super(props);
    this.searchContent = '';
    this.touchSelect = null;
    this.isLoading = false;

    this._laoding = false

    this._musicList = [{ id: new Date(), song: '罗志祥时间科学管理', name: 'pencott' }]
  }

  componentDidMount() {
    super.componentDidMount()
    this._initial()
  }

  _initial = async () => {
    const data = await require('../../model/room/MusicModel').default.getMusicLibrary()
    if (!data) return
    this._musicList = data;
    this.forceUpdate()
  }

  _changeSearchContent = s => {
    this.searchContent = s;
    this.forceUpdate();
    if (this.searchContent == '') {
      this._searchSongs()
    }
  }

  _searchSongs = async () => {
    const res = await require('../../model/room/MusicModel').default.searchMusic(UserInfoCache.userId, this.searchContent, null, 13)

    if (!res) return

    this._musicList = res;
    this.forceUpdate()
  }

  _loadMore = () => {
    if (this.isLoading) return alert('to do something')
  }

  _addMusicList = index => {
    this.touchSelect = index;
    this.forceUpdate()
  }


  _downLoadMusic = async (item, url) => {
    require('../../model/room/MusicModel').default.downLoadMusic(url, this._downloading, this._downloadFinished)
    item.isLoading = true;
    this.forceUpdate()
    // this.forceUpdate()
  }

  _downloading = (downloadBytes, fileSize) => {
    // console.log('下载进度', downloadBytes / fileSize)
  }

  _downloadFinished = async (bool) => {
    if (bool) {

      ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_MUSIC_LIST, false)

      if (this.searchContent !== '') return this._searchSongs()

      await this._initial()
      require('../base/ToastUtil').default.showCenter('下载完并添加至我的列表')
      return
    }
    require('../base/ToastUtil').default.showCenter('下载失败请检查网络')

  }


  _renderItem = ({ item, index }) => {
    const song = item.musicName;
    const singer = item.singerName;
    const img = require('../../hardcode/skin_imgs/roomMusic').ic_downloaded();
    const imgDownload = require('../../hardcode/skin_imgs/roomMusic').ic_download();
    const songDownUrl = item.downloadURL;
    const isDoloaded = item.isDoloaded !== null ? item.isDoloaded : false;
    const isLoading = item.isLoading !== null ? item.isLoading : false;
    // 判断歌曲状态
    let state
    if (isDoloaded) {
      state = null

    } else if (!isDoloaded && isLoading) {
      state = (
        <ActivityIndicator
          animating
          color="#FF95A4"
          style={{
            width: DesignConvert.getW(18),
            height: DesignConvert.getH(18),
            marginRight: DesignConvert.getW(25),
          }}
        />
      )
    } else {
      state = (
        <ImgTouchableOpacity
          onPress={() => { this._downLoadMusic(item, songDownUrl) }}
          source={imgDownload}
          touchStyle={{
            width: DesignConvert.getW(40),
            height: DesignConvert.getW(40),
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          style={{
            width: DesignConvert.getW(18),
            height: DesignConvert.getH(18),
            marginRight: DesignConvert.getW(25),
          }}
        />
      )
    }
    return (
      <TouchableOpacity
        onPress={() => this._addMusicList(index)}
        style={{
          width: DesignConvert.swidth,
          height: DesignConvert.getH(53),
          flexDirection: 'row',
          backgroundColor: index === this.touchSelect ? '#FFFBFB' : 'white',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            marginLeft: DesignConvert.getW(20),
            justifyContent: 'flex-start'
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: '#333333',
              fontSize: DesignConvert.getF(13),
              maxWidth: DesignConvert.getW(200)
            }}
          >{song}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: DesignConvert.getH(5),
              alignItems: 'center'
            }}
          >
            {isDoloaded ? <Image
              style={{
                width: DesignConvert.getW(12),
                height: DesignConvert.getH(12),
                marginRight: DesignConvert.getW(5),
                resizeMode: 'contain'
              }}
              source={img}
            /> : null}
            <Text
              style={{
                color: '#B8B8B8',
                fontSize: DesignConvert.getF(11)
              }}
            >{singer}</Text>
          </View>
        </View>

        {state}
      </TouchableOpacity>
    )
  }

  _renderEmpty = () => {
    return (
      <View
        style={{
          flex: 1,
          width: DesignConvert.swidth,
          height: DesignConvert.getH(600),
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text>无此音乐，请重新搜索</Text>
      </View>
    )
  }

  _renderSearchBar = () => {
    const searchImg = require('../../hardcode/skin_imgs/search').ic_search()
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: DesignConvert.getH(10) + DesignConvert.statusBarHeight
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: DesignConvert.getW(290),
            height: DesignConvert.getH(27),
            borderRadius: DesignConvert.getW(15),
            backgroundColor: 'rgba(245, 245, 245, 1)'
          }}
        >

          <ImgTouchableOpacity
            source={searchImg}
            onPress={this._searchSongs}
            style={{
              width: DesignConvert.getW(14),
              height: DesignConvert.getH(14),
              tintColor: '#DCDCDC',
              resizeMode: 'contain',
              marginRight: DesignConvert.getW(8),
              marginLeft: DesignConvert.getW(10)
            }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: DesignConvert.getF(13),
              paddingTop: 0,
              padding: 0,
              alignItems: 'center'
            }}
            keyboardType="default"
            returnKeyType="search"
            // value={this.searchContent}
            onChangeText={this._changeSearchContent}
            placeholder='搜索歌曲 歌手'
            placeholderTextColor="#DCDCDC"
            onSubmitEditing={this._searchSongs}
          />
        </View>
        <TouchableOpacity
          onPress={this.popSelf}
          style={{
            minWidth: DesignConvert.getW(25),
            height: DesignConvert.getH(15),
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: DesignConvert.getW(8)
          }}
        >
          <Text
            style={{
              fontSize: DesignConvert.getF(13),
              color: '#FF95A4'
            }}
          >取消</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1
        }}
      >
        {this._renderSearchBar()}
        <FlatList
          data={this._musicList}
          renderItem={this._renderItem}
          showsVerticalScrollIndicator={false}
          initialNumToRender={13}
          ListEmptyComponent={this._renderEmpty}
          onEndReached={this._loadMore}
          onEndReachedThreshold={0.2}
          style={{
            width: DesignConvert.swidth,
            // paddingLeft: DesignConvert.getW(16),
            // paddingRight: DesignConvert.getW(16),
            marginTop: DesignConvert.getH(15),
            height: DesignConvert.getH(640),
            backgroundColor: 'white',
          }}
        />
      </View>
    )
  }
}