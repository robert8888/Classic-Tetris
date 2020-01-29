import EventObject from "../../Hellpers/Events/EventObject.js";

export default class ViewElement extends EventObject{
    constructor(state) {
        super();
        this._state = state;
    }


}