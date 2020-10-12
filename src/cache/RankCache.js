/**
 * 排行榜缓存数据
 */

'use strict';

import ModelEvent from "../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_RANK_PAGE_INDEX } from "../hardcode/HLogicEvent";



//榜单打开时的index
let rank_index = 1;

export const extChangeRankPageIndex = (i) => {
    rank_index = i;
    ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_RANK_PAGE_INDEX, i);
}

export const getChangeRankPangeIndex = () => {
    return rank_index;
}