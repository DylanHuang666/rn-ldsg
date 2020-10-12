let _micPostionMap = {};
let _emptyObj = {};

/**
 * 主麦位是0
 * 其它依次是 1 - 8
 */

const MicPostionModel = {

    setMicPostionWithIndex(index, data) {
        _micPostionMap[index] = data
    },

    getMicPostionWithIndex(index) {
        return _micPostionMap[index] || _emptyObj;
    }

}

export default MicPostionModel;