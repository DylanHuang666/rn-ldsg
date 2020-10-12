'use strict'

import Config from "../../configs/Config";

export const ic_cer_back = () => Config.getRNImageUrl('certification/ic_cer_back.png', 0);

export const ic_cer_font = () => Config.getRNImageUrl('certification/ic_cer_font.png', 0);

export const ic_pic = () => ({uri: Config.getRNImageUrl('certification/ic_pic.png', 1)});

export const ic_report = () => ({uri: Config.getRNImageUrl('certification/ic_report.png', 0)});

export const ic_selected = () => ({uri: Config.getRNImageUrl('certification/ic_selected.png', 0)});

export const ic_unselected = () => ({uri: Config.getRNImageUrl('certification/ic_unselected.png', 0)});

export const ic_cer_bg = () => ({uri: Config.getRNImageUrl('certification/ic_cer_bg.png', 0)});

export const ic_correct = () => ({uri: Config.getRNImageUrl('certification/ic_correct.png', 0)});

export const ic_incomplete = () => ({uri: Config.getRNImageUrl('certification/ic_incomplete.png', 0)});

export const ic_blurry = () => ({uri: Config.getRNImageUrl('certification/ic_blurry.png', 0)});

export const ic_lightly = () => ({uri: Config.getRNImageUrl('certification/ic_lightly.png', 0)});

export const ic_yes = () => ({uri: Config.getRNImageUrl('certification/ic_yes.png', 0)});

export const ic_no = () => ({uri: Config.getRNImageUrl('certification/ic_no.png', 0)});

//状态icon
export const ic_status_successful = () => ({uri: Config.getRNImageUrl('certification/ic_status_successful.png', 0)});

export const ic_status_ing = () => ({uri: Config.getRNImageUrl('certification/ic_status_ing.png', 0)});

export const ic_status_fail = () => ({uri: Config.getRNImageUrl('certification/ic_status_fail.png', 0)});
