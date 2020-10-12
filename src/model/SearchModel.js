import HResultStatus from "../hardcode/HResultStatus";
import AsyncStorage from '@react-native-community/async-storage';
import UserInfoModel from "./userinfo/UserInfoModel";


const SearchModel = {


    /**
     * 搜索用户
     * @param {string} keyword 查找的关键字
     * @param {int} start 获取起始数据
     * @param {int} end 获取结束数据
     * @param {string} overLookUserId 玩家id (加自己id就屏蔽自己)
     */
    async searchUserInfoList(keyword, start, end) {

        const res = await require("../model/ServerCmd").DataCmd_getRecommendUserInfoList({
            keyword,
            start,
            end
        })

        if (HResultStatus.Success != res.state) {
            require("../model/ErrorStatusModel").default.showTips(res.start)
            return [];
        }

        if (!res.data || !res.data.list) {
            return [];
        }

        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()

        res.data.list.forEach(element => {
            if (element.base) {
                element.base.isBigV = !!vipIds[element.base.userId];
            }
            element.key = element.userId;
        });
        return res.data.list;
    },


    /**
     * 搜索房间
     * @param {string} userId 玩家id
     * @param {string} keyword 查找的关键字
     * @param {int} index 分页下标
     */
    async searchRoom(keyword, index) {

        const res = await require("../model/ServerCmd").CenterCmd_searchFunRoom({
            userId: require("../cache/UserInfoCache").default.userId,
            keyword,
            index
        })

        if (HResultStatus.Success != res.state) {
            require("../model/ErrorStatusModel").default.showTips(res.start)
            return [];
        }

        if (!res.data || !res.data.list) {
            return [];
        }

        res.data.list.forEach(element => {
            element.key = element.roomId;
        });
        return res.data.list;
    },

    async searchTopic(keyword) {
        // //搜索话题列表:返回MomentResult.SquareTopicVOs
        // message searchTopic {
        //     required string keyword = 1;//查找的关键字
        //     optional int32 index = 2; //分页下标
        // }

        const res = await require("../model/ServerCmd").MomentCmd_searchTopic({
            keyword,
            index: 0
        })


        if (HResultStatus.Success != res.state) {
            require("../model/ErrorStatusModel").default.showTips(res.start)
            return [];
        }

        if (!res.data || !res.data.squareTopicVO) {
            return [];
        }

        // res.data.list.forEach(element => {
        //     element.key = element.roomId;
        // });
        res.data.squareTopicVO.forEach(item => {

            if (item.topicData.pic && item.topicData.id) {
                item.uri = require('../configs/Config').default.getTopicPicUrl(item.topicData.pic)
                item.key = item.topicData.id
            }


        })
        return res.data.squareTopicVO;
    },

    /**
     * 获取搜索记录
     */
    async getSearchKeyStorage() {
        let s = await AsyncStorage.getItem('@searchKeyStorage')

        if (!s) {
            return [];
        }
        let list = s.split(",");
        return list;
    },

    /**
     * 保存搜索记录
     */
    async saveSearchKeyStorage(key) {
        let list = await SearchModel.getSearchKeyStorage();
        let s
        if (!list) {
            s = key;
        } else {
            list = [key].concat(list);
            list = Array.from(new Set(list));
            list.length > 10 && list.pop();
            s = list.join();
        }
        // console.log("保存搜索记录", s);
        try {
            await AsyncStorage.setItem('@searchKeyStorage', s);
            return true;
        } catch (e) {

        }
        return false;
    },

}

export default SearchModel;