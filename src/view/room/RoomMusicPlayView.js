import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Animated, PanResponder, NativeModules, Easing } from "react-native";
import BaseView from "../base/BaseView";
import DesignConvert from "../../utils/DesignConvert";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_UPDATE_ROOM_MUSIC_LIST, EVT_UPDATE_MUSIC_PLAY } from "../../hardcode/HGlobalEvent";

class MusicControl extends PureComponent {
  constructor(props) {
    super(props);
    this._isPlayOrSuspend = false;

    this._firstTime = true
    // this._playMusicUrl = '/storage/emulated/0/yinfuLive/downMusic/Havana.mp3'
    this._musicPlatState = 0;
  }

  _switchPlay = () => {
    // 是否是第一次播放
    this.props.playOrSuspend()
  }


  _switchPlatState = () => {
    this.props.musicModelChange()
  }

  render() {
    const preImg = require('../../hardcode/skin_imgs/roomMusic').ic_previous_play();
    const nextImg = require('../../hardcode/skin_imgs/roomMusic').ic_next_play();
    const controlImg = this.props.musicState ? require('../../hardcode/skin_imgs/roomMusic').ic_play()
      : require('../../hardcode/skin_imgs/roomMusic').ic_suspend();
    let platStateImg
    switch (this.props.playmusicMode) {
      case 0:
        platStateImg = require('../../hardcode/skin_imgs/roomMusic').ic_order_play()
        break;
      case 1:
        platStateImg = require('../../hardcode/skin_imgs/roomMusic').ic_loop_play()

        break;
      default:
        platStateImg = require('../../hardcode/skin_imgs/roomMusic').ic_singel_order_play()
        break;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          ...this.props.style
        }}
      >
        <ImgTouchableOpacity
          onPress={() => { this.props.checkoutSongs(false) }}
          source={preImg}
          style={{
            width: DesignConvert.getW(18),
            height: DesignConvert.getH(18)
          }}
        />
        <ImgTouchableOpacity
          onPress={this._switchPlay}
          source={controlImg}
          style={{
            width: DesignConvert.getW(64),
            height: DesignConvert.getH(64),
            marginLeft: DesignConvert.getW(39),
            marginRight: DesignConvert.getW(39),
          }}
        />
        <ImgTouchableOpacity
          onPress={() => { this.props.checkoutSongs(true) }}
          source={nextImg}
          style={{
            width: DesignConvert.getW(18),
            height: DesignConvert.getH(18)
          }}
        />
        <ImgTouchableOpacity
          onPress={this._switchPlatState}
          source={platStateImg}
          style={{
            width: DesignConvert.getW(18),
            height: DesignConvert.getH(18),
            marginLeft: DesignConvert.getW(51)
          }}
        />
      </View>
    )
  }
}

export class ImgTouchableOpacity extends PureComponent {
  render() {
    return <TouchableOpacity
      onPress={this.props.onPress ? this.props.onPress : null}
      style={{
        ...this.props.touchStyle
      }}
    >
      <Image
        style={{
          ...this.props.style
        }}
        source={this.props.source}
      />
    </TouchableOpacity>
  }
}

class VolumeSize extends PureComponent {
  constructor(props) {
    super(props);
    // const initLeft = props.left
    // console.log('asdsa', props.left)
    this.left = DesignConvert.getW(100)
    this.lastX = this.left
    // this.lastX = this.state.left;
  }

  initLeft = left => {
    this.lastX = left
    this.left = left
    this._adjustVolume(left)
    this.forceUpdate()
  }

  // 调整音量
  _adjustVolume = left => {
    NativeModules.Agora.adjustAudioMixingVolume(Math.ceil((left * 100) / 255))
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     // if (nextProps.left < DesignConvert.getW(7.5)) {
  //     //     this.setState.left = nextProps.left
  //     // }
  //     this.left = nextProps.left
  //     this.lastX = nextProps.left
  //     // console.log('asdsa', nextProps.left)
  //     // this.items = nextProps.items;
  //     return true;
  // }


  componentWillMount() {
    this._panResponderTouch = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },
      onPanResponderGrant: (evt, gestureState) => {

        this.left = evt.nativeEvent.locationX;
        if (this.left > DesignConvert.getW(225)) { this.left = DesignConvert.getW(225) }
        this.lastX = this.left;
        this._adjustVolume(this.left)


        this.forceUpdate()

      },
      onPanResponderMove: (evt, gestureState) => {

        let left
        if ((this.lastX + gestureState.dx) <= 0) {
          left = 0;
        } else if ((this.lastX + gestureState.dx) > DesignConvert.getW(225)) {
          left = DesignConvert.getW(225);
        } else {
          left = this.lastX + gestureState.dx
        }
        this._adjustVolume(left)
        this.left = left;
        this.forceUpdate()
      },
      onPanResponderRelease: (evt, gestureState) => {
        // this._unhighlight();
        this.lastX = this.left;
        this.forceUpdate()
        // this.lastY = this.state.marginTop;
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
    });

  }
  render() {
    const imgVolumeMute = require('../../hardcode/skin_imgs/roomMusic').ic_music_mute()
    const imgVolumeOpen = require('../../hardcode/skin_imgs/roomMusic').ic_music_open()
    return (
      <View
        style={{
          flexDirection: 'row',
          // backgroundColor: 'red',
          alignItems: 'center',
          marginTop: DesignConvert.getH(18)
        }}
      >
        <ImgTouchableOpacity
          onPress={() => { this.initLeft(0) }}
          source={imgVolumeMute}
          style={{
            width: DesignConvert.getW(18),
            height: DesignConvert.getH(18)
          }}
        />
        <View
          style={{
            width: DesignConvert.getW(240),
            height: DesignConvert.getH(40),
            borderRadius: DesignConvert.getW(4),
            justifyContent: 'center',
            backgroundColor: 'white',
            marginLeft: DesignConvert.getW(20),
            marginRight: DesignConvert.getW(20),
          }}
        >
          <View
            style={{
              position: 'absolute',
              borderRadius: DesignConvert.getW(4),
              height: DesignConvert.getH(4),
              width: DesignConvert.getW(240),
              backgroundColor: '#F9F9F9FF',
            }}
          />

          <View
            style={{
              position: 'absolute',
              borderRadius: DesignConvert.getW(4),
              height: DesignConvert.getH(4),
              width: this.left + DesignConvert.getW(7.5),
              backgroundColor: '#FF95A4'
            }}

          />
          <View
            style={{
              position: 'absolute',
              borderRadius: DesignConvert.getW(4),
              height: DesignConvert.getH(40),
              backgroundColor: 'white',
              opacity: 0,
              width: DesignConvert.getW(240),
            }}
            {...this._panResponderTouch.panHandlers}
          />
          <View
            style={{
              width: DesignConvert.getW(15),
              height: DesignConvert.getH(15),
              // left: DesignConvert.getW(211),
              borderRadius: DesignConvert.getW(40),
              backgroundColor: '#FF95A4',
              position: 'absolute',
              left: this.left
            }}
          />

        </View>
        <ImgTouchableOpacity
          onPress={() => { this.initLeft(DesignConvert.getW(225)) }}
          source={imgVolumeOpen}
          style={{
            width: DesignConvert.getW(18),
            height: DesignConvert.getH(18)
          }}
        />
      </View>
    )
  }
}

export default class RoomMusicPlayView extends BaseView {
  constructor(props) {
    super(props);

    this.isShowList = false;

    this._musicUrl = '';

    this._isFirstPlay = require('../../model/room/MusicModel').isFirstPlay()

    this._musicState = require('../../model/room/MusicModel').musicState();

    this._musicPlayModel = require('../../model/room/MusicModel').playMode();


    this._musicList = [{ song: '爱了', name: 'pencott' }];
    this._height = new Animated.Value(0)
  }

  _showOrHideMusicList = () => {
    this.isShowList = !this.isShowList;
    if (this.isShowList) {
      this.forceUpdate()
      // Animated.timing(this._height, {
      //   toValue: DesignConvert.getH(-330),
      //   duration: 500,
      //   easing: Easing.linear,
      //   isInteraction: false,
      //   useNativeDriver: true
      // }).start()
      this._animatedTransFormX(DesignConvert.getH(-330))
    } else {
      this._animatedTransFormX(DesignConvert.getW(0))
    }
  }

  _animatedTransFormX = (s) => {
    if (!this.isShowList) {
      Animated.timing(this._height, {
        toValue: s,
        duration: 500,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true
      }).start(() => { this.forceUpdate() })
    } else {
      Animated.timing(this._height, {
        toValue: s,
        duration: 500,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true
      }).start()
    }

  }

  componentDidMount() {
    super.componentDidMount();
    ModelEvent.addEvent(null, EVT_UPDATE_ROOM_MUSIC_LIST, this._initialData)
    ModelEvent.addEvent(null, EVT_UPDATE_MUSIC_PLAY, this._changeMusicPlay)
    this._initialData(true)

  }

  componentWillUnmount() {
    super.componentWillUnmount();
    ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_MUSIC_LIST, this._initialData)
    ModelEvent.removeEvent(null, EVT_UPDATE_MUSIC_PLAY, this._changeMusicPlay)
  }

  _onMusicLibararyView = () => {
    require("../../router/level3_router").showMusicLibararyView()
  }

  _changeMusicPlay = url => {
    this._musicUrl = url;
    this.forceUpdate()
  }


  _initialData = async (bool) => {
    this._musicState = require('../../model/room/MusicModel').musicState()

    const res = await require('../../model/room/MusicModel').default.getMyMusicListData()
    if (res === []) return
    this._musicList = res


    this._musicUrl = require('../../model/room/MusicModel').playingUrl()

    // 如果第一次打开音乐列表 默认歌曲列表第一个
    if (this._isFirstPlay) {
      this._musicUrl = res[0].playUrl;
    }

    this._musicState = require('../../model/room/MusicModel').musicState();

    this._isFirstPlay = require('../../model/room/MusicModel').isFirstPlay();

    this.forceUpdate()

  }

  _loadMore = url => {
  }

  _palyMusic = url => {
    this._musicUrl = url;

    require('../../model/room/MusicModel').startPlayMusic(url)

    this._musicState = require('../../model/room/MusicModel').musicState();

    this._isFirstPlay = require('../../model/room/MusicModel').isFirstPlay();

    this.forceUpdate()
  }

  _playOrSuspend = () => {

    if (this._musicUrl === '') return alert('请选择音乐再播~')

    if (this._isFirstPlay) {
      require('../../model/room/MusicModel').startPlayMusic(this._musicUrl)

      this._musicState = require('../../model/room/MusicModel').musicState();

      this._isFirstPlay = require('../../model/room/MusicModel').isFirstPlay();

      this.forceUpdate()

      return
    }

    this._musicState = !this._musicState

    require('../../model/room/MusicModel').playOrSuspend(this._musicState)

    this.forceUpdate()
  }

  _deleteMusic = (downUrl, playUrl) => {
    require('../../model/room/MusicModel').deletMusic(downUrl, playUrl)
    this._initialData(true)

  }

  _isDeleteMusic = (downUrl, playUrl) => {
    require('../../router/level2_router').showNormInfoDialog('是否确认删除', '确认', this._deleteMusic.bind(this, downUrl, playUrl))
  }

  _switchNextOrPre = bool => {
    // 如果是第一次播放
    if (this._isFirstPlay) return this._playOrSuspend()


    require('../../model/room/MusicModel').switchNextOrPre(bool, this._musicList, this._musicUrl)

    this._musicState = require('../../model/room/MusicModel').musicState();

    this._isFirstPlay = require('../../model/room/MusicModel').isFirstPlay();

    this._musicUrl = require('../../model/room/MusicModel').playingUrl();

    this.forceUpdate()

  }

  _musicModelChange = () => {
    if (this._musicPlayModel === 2) {
      this._musicPlayModel = 0;
      this.forceUpdate();
      require('../../model/room/MusicModel').switchMusicPlayModel(this._musicPlayModel)
      return
    }
    this._musicPlayModel++
    require('../../model/room/MusicModel').switchMusicPlayModel(this._musicPlayModel)
    this.forceUpdate()
  }

  _renderEmpty = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text>亲~你还没有自己的歌曲哦，赶紧去我的音乐库下载吧。</Text>
      </View>
    )
  }

  _renderMusicItem = ({ item, index }) => {
    const songName = item.musicName;
    const singer = item.singerName;
    const url = item.playUrl;
    const downUrl = item.downloadURL;
    const playUrl = item.playUrl;
    const isPlay = this._musicUrl === item.playUrl
    const deletImg = require('../../hardcode/skin_imgs/roomMusic').ic_delete()
    const gif = require('../../hardcode/skin_imgs/roomMusic').live_status_white()
    const playState = isPlay ? (
      <Image
        source={gif}
        style={{
          width: DesignConvert.getW(11),
          height: DesignConvert.getH(12),
          tintColor: '#FF95A4',
          marginRight: DesignConvert.getW(5)
        }}
      />
    ) : null
    return (
      <TouchableOpacity
        onPress={() => { this._palyMusic(url) }}
        style={{
          width: DesignConvert.getW(375) - DesignConvert.getW(32),
          height: DesignConvert.getH(40),
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {playState}
          <Text
            numberOfLines={1}
            style={{
              maxWidth: DesignConvert.getW(180),
              color: isPlay ? '#FF95A4' : '#333333',
              fontSize: DesignConvert.getF(13)
            }}
          >
            {songName}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              maxWidth: DesignConvert.getW(80),
              color: isPlay ? '#FF95A4' : '#B8B8B8',
              fontSize: DesignConvert.getF(11)
            }}
          >
            {` — ${singer}`}
          </Text>
        </View>


        <ImgTouchableOpacity
          onPress={() => { this._isDeleteMusic(downUrl, playUrl) }}
          touchStyle={{
            width: DesignConvert.getW(40),
            height: DesignConvert.getW(40),
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          style={{
            width: DesignConvert.getW(12),
            height: DesignConvert.getW(12),
          }}
          source={deletImg}
        />
      </TouchableOpacity>
    )
  }

  _renderMusicList = () => {
    if (this.isShowList)
      return (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: DesignConvert.getH(-160),
            transform: [{ translateY: this._height }]
          }}
        >
          <View
            style={{
              // display: this.isShowList ? 'flex' : 'none',
              // width: DesignConvert.swidth,
              width: DesignConvert.getW(375),
              height: DesignConvert.getH(30),
              alignItems: 'center',
              justifyContent: 'flex-end',
              backgroundColor: 'white',
              borderTopLeftRadius: DesignConvert.getW(10),
              borderTopRightRadius: DesignConvert.getW(10)
            }}
          >
            <Text
              style={{
                fontSize: DesignConvert.getF(16),
                color: '#333333',
              }}
            >歌单</Text>
          </View>
          <FlatList
            data={this._musicList}
            renderItem={this._renderMusicItem}
            showsVerticalScrollIndicator={false}
            // onRefresh={this._initialData()}
            refreshing
            onEndReached={this._loadMore}
            onEndReachedThreshold={0.2}
            initialNumToRender={6}
            ListEmptyComponent={this._renderEmpty}
            // ListHeaderComponent={this._renderMusicListHead}
            style={{
              width: DesignConvert.swidth,
              paddingLeft: DesignConvert.getW(16),
              paddingRight: DesignConvert.getW(16),
              paddingBottom: DesignConvert.getW(5),
              height: DesignConvert.getH(300),
              backgroundColor: 'white',
            }}
          />
        </Animated.View>

      )
    return null
  }

  render() {
    const imgUrl = this.isShowList ? require('../../hardcode/skin_imgs/roomMusic').ic_hide()
      : require('../../hardcode/skin_imgs/roomMusic').ic_show()
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000066'
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1
          }}
          onPress={this.popSelf}
        />
        {this._renderMusicList()}
        <View
          style={{
            borderTopLeftRadius: this.isShowList ? 0 : DesignConvert.getW(10),
            borderTopRightRadius: this.isShowList ? 0 : DesignConvert.getW(10),
            backgroundColor: 'white',
            height: DesignConvert.getH(170),
            alignItems: 'center',
          }}
        >
          <ImgTouchableOpacity
            onPress={this._showOrHideMusicList}
            style={{
              marginTop: DesignConvert.getH(10),
              width: DesignConvert.getW(26),
              height: DesignConvert.getH(14)
            }}
            source={imgUrl}
          />
          <VolumeSize />
          <View
            style={{
              flexDirection: 'row',
              marginTop: DesignConvert.getH(11),
              alignItems: 'center',
              width: DesignConvert.swidth
            }}
          >
            <TouchableOpacity
              onPress={this._onMusicLibararyView}
              style={{
                marginLeft: DesignConvert.getW(20)
              }}
            >
              <Text
                style={{
                  color: '#FF95A4',
                  fontSize: DesignConvert.getF(14),
                }}
              >音乐库</Text>
            </TouchableOpacity>

            <MusicControl
              playmusicMode={this._musicPlayModel}
              musicModelChange={this._musicModelChange}
              checkoutSongs={this._switchNextOrPre}
              playOrSuspend={this._playOrSuspend}
              musicState={this._musicState}
              musicUrl={this._musicUrl}
              style={{
                marginLeft: DesignConvert.getW(41)
              }}
            />
          </View>
        </View>
      </View>
    )
  }
}

