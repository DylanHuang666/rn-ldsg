const fonts_gift_img_map = {
    'x': {
        w: 9,
        h: 18,
        img: require('../../../images/fonts/gift/x.png'),
    },
    '0': { w: 25, h: 42, img: require('../../../images/fonts/gift/0.png') },
    '1': { w: 25, h: 42, img: require('../../../images/fonts/gift/1.png') },
    '2': { w: 25, h: 42, img: require('../../../images/fonts/gift/2.png') },
    '3': { w: 25, h: 42, img: require('../../../images/fonts/gift/3.png') },
    '4': { w: 25, h: 42, img: require('../../../images/fonts/gift/4.png') },
    '5': { w: 25, h: 42, img: require('../../../images/fonts/gift/5.png') },
    '6': { w: 25, h: 42, img: require('../../../images/fonts/gift/6.png') },
    '7': { w: 25, h: 42, img: require('../../../images/fonts/gift/7.png') },
    '8': { w: 25, h: 42, img: require('../../../images/fonts/gift/8.png') },
    '9': { w: 25, h: 42, img: require('../../../images/fonts/gift/9.png') },
}

// const fonts_zadan_img_map = {
//     'x': {
//         w: 9,
//         h: 18,
//         img: require('../../../images/room/gift/zadanx.png'),
//     },
//     '1': { w: 25, h: 42, img: require('../../../images/room/gift/zadan1.png') },
//     '2': { w: 25, h: 42, img: require('../../../images/room/gift/zadan2.png') },
//     '3': { w: 25, h: 42, img: require('../../../images/room/gift/zadan3.png') },
//     '4': { w: 25, h: 42, img: require('../../../images/room/gift/zadan4.png') },
//     '5': { w: 25, h: 42, img: require('../../../images/room/gift/zadan5.png') },
//     '6': { w: 25, h: 42, img: require('../../../images/room/gift/zadan6.png') },
//     '7': { w: 25, h: 42, img: require('../../../images/room/gift/zadan7.png') },
//     '8': { w: 25, h: 42, img: require('../../../images/room/gift/zadan8.png') },
//     '9': { w: 25, h: 42, img: require('../../../images/room/gift/zadan9.png') },
// }

export const fonts_gift_map = (num) => {

    let vo = fonts_gift_img_map[num];
    return vo;
};

// export const fonts_zadan_map = (num) => {

//     let vo = fonts_zadan_img_map[num];
//     return vo;
// };