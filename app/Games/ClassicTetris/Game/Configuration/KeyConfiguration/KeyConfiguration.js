import keyConfig from "./keyConfig.js";

export default class KeyConfiguration {
    constructor(config) {
        if(config){
            this._config = config;
        }
        else this._config = keyConfig;
    }

    get(key){
        for(let action in this._config.actions){
            let keys = this._config.actions[action];
            if(keys === key){
                return action;
            }
            if(keys instanceof Array){
            if(keys.includes(key)){
                return action;
                }
            }
        }
    }
}