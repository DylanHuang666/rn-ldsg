
'use strict';

import HGLobal from '../hardcode/HGLobal'
import HGlobal from '../hardcode/HGLobal';

const EggModel = {

    async getEggDisplayConfig() {

        const result = await require('./staticdata/StaticDataModel').getEggDisplayConfig()

        if (!result) {
            return
        }
        const vo = result[0]

        if (!vo) {
            return
        }

        HGLobal.EGG_ACTION = `${vo.playname}`
        HGLobal.EGG_ACTION_NAME = `${vo.playname}${vo.playobj}`
        HGlobal.EGG_A = `${vo.egg1name}`
        HGlobal.EGG_B = `${vo.egg2name}`
        HGLobal.EGG_C = `${vo.egg3name}`
    }
}

export default EggModel