import ModelEvent from "../../utils/ModelEvent"
import { EVT_LOGIC_CHAT_HALL } from "../../hardcode/HLogicEvent"



export default async function (evtName, data) {

    ModelEvent.dispatchEntity(null, EVT_LOGIC_CHAT_HALL, data)
}