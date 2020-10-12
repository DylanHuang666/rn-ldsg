import ToastUtil from '../view/base/ToastUtil'


const BannerModel = {


    //获取直播间大Banner
    async getRoomBigBanner() {
        const result = await require('./staticdata/StaticDataModel').getRoomBigBanner()


        if (!result) {
            return []
        }

        return result
    },

    _clickRoomBigBanner(item) {

        switch (item.type) {
            case 1:
                require('../router/level2_router').showMyWebView(item.title, item.targetobject)
                break;
            case 2:
                ToastUtil.showCenter('跳转直播间')
                break;
            case 3:
                require('../router/level3_router').openActivityWebView(item.targetobject)
                break;
        }

    },


    //获取SquareBanner
    async getSquareBanner() {
        const result = await require('./staticdata/StaticDataModel').getSquareBanner()
        if (!result) {
            return []
        }
        return result
    }

}

export default BannerModel;