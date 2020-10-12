
/**
 * 关于我们逻辑
 */
'use strict';

import HClientTables from "../../hardcode/HClientTables";


const AboutUsModel = {
    /**
     * 读取渠道表http://xvoice-res1-1301112906.file.myqcloud.com/app/data/CS_ChannelInfo?71857423
     */
    async getRechargeTableData() {
        const tableVo = HClientTables.CS_ChannelInfo;

        const data = await require("../StaticDataModel").default.getStaticDataTable(tableVo);

        // "keys":["channelid","channelname","version","downloadurl","forceupdate","iospaytype","issanbox","desc","newvisitor","oldvisitor"]
        return data;
    },

}

export default AboutUsModel;