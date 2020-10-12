

// 用户进入了IM的群
// message EnterImGroupBroadcast {
// 	required int32 type = 1;// 群自定义类型，1-官方消息
// 	required string groupId = 2;// 群id

import UserInfoCache from "../../cache/UserInfoCache";

// }
export default async function (evName, data) {
     //TODO:广播没收到
     // console.log("用户进入了IM的群", data.groupId)
     // data.groupId

     UserInfoCache.setOfficialGroupId(data.groupId)

}