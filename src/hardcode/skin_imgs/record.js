/*
 * @Author: 
 * @Date: 2020-10-07 11:16:43
 * @LastEditors: your name
 * @LastEditTime: 2020-10-08 16:18:42
 * @Description: file content
 */

'use strict'

import Config from "../../configs/Config";
import { COIN_NAME } from "../HGLobal";

export const record_alipay = () => ({ uri: Config.getRNImageUrl('record/record_alipay.png', 3) });

export const record_bank = () => ({ uri: Config.getRNImageUrl('record/record_bank.png', 3) });

export const record_cash = () => ({ uri: Config.getRNImageUrl('record/record_cash.png', 3) });

export const record_coin = () => COIN_NAME == "钻石" ? ({ uri: Config.getRNImageUrl('record/record_diamon.png', 3) }) : ({ uri: Config.getRNImageUrl('record/record_coin.png', 3) });

export const record_wechat = () => ({ uri: Config.getRNImageUrl('record/record_wechat.png', 3) });

export const record_jb = () => require('../../../images/record_jb.png')