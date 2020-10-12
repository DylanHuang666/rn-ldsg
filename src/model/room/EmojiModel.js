


const EmojiModel = {

    /**
     * 大表情列表
     */
    async getBigEmoji() {

        const result = await require('../staticdata/StaticDataModel').getRecreation()

        // console.log('大表情列表', result)

        if (!result) {
            return []
        }

        return result
    },
}

export default EmojiModel;