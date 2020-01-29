export default class EventObject {
    constructor() {
    }

    on(eventName, callback){
        if(!this.events) {
            this.events = new Map();
        }
        this.events.set(eventName, callback);
    }

    fire(eventName, ...args){
        if(!this.events){
            return;
        }
        if(this.events.has(eventName)){
            let callback = this.events.get(eventName);
            callback(...args);
        }
    }
}