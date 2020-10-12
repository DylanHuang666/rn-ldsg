/**
 * 主界面逻辑
 */
'use strict';

import { extChangeRankPageIndex } from '../../cache/RankCache';

let sm_navigation;
let sm_state;

export const INDEX_HOME = 0;
export const INDEX_RANK = 1;
export const INDEX_MESSAGE = 2;
export const INDEX_MINE = 3;


export const setTabBarData = (navigation, state) => {
    sm_navigation = navigation;
    sm_state = state;
}

export const doNavigationTo = (bar_index) => {
    if (!sm_state) return;
    if (!sm_navigation) return;

    const route = sm_state.routes[bar_index];
    const isFocused = sm_state.index === bar_index;

    const event = sm_navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
        //添加逻辑,从其他tab切换到“头条”tab，需自动刷新并落地到头部，目前切换到头条tab未自动刷新
        if(route.name == "Rank") {
            extChangeRankPageIndex(2);
        }
        sm_navigation.navigate(route.name);
    }
}

export const doLongPress = (bar_index) => {
    if (!sm_state) return;
    if (!sm_navigation) return;

    const route = sm_state.routes[bar_index];

    sm_navigation.emit({
        type: 'tabLongPress',
        target: route.key,
    });
}

/**
 * 跳转到榜单
 */
export const navigateToRankPage = () => {
    doNavigationTo(INDEX_RANK);
}