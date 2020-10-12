'use strict'

import Config from "../../configs/Config";

export const ic_phone = () => ({uri: Config.getRNImageUrl('registered/ic_phone.png', 0)});

export const ic_code = () => ({uri: Config.getRNImageUrl('registered/ic_code.png', 0)});

export const ic_password = () => ({uri: Config.getRNImageUrl('registered/ic_password.png', 0)});

export const ic_change_header = () => ({uri: Config.getRNImageUrl('registered/ic_change_header.png', 0)});

export const ic_default_header = () => (Config.getRNImageUrl('registered/ic_default_header.png', 0));

export const ic_default_female = () => ({uri: Config.getRNImageUrl('registered/ic_default_female.png', 1)});

export const ic_default_male = () => ({uri: Config.getRNImageUrl('registered/ic_default_male.png', 1)});