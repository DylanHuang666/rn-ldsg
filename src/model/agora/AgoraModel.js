'use strict'

import { NativeModules, NativeEventEmitter } from "react-native"

const emmiter = new NativeEventEmitter(NativeModules.Agora);


export const addEventListener = (evt, fn) => {
    emmiter.addListener(evt, fn);
}

export const removeEventListener = (evt, fn) => {
    emmiter.removeListener(evt, fn);
}