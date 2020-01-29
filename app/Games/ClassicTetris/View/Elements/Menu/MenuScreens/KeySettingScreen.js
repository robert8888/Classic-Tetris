import OverLayer from "./OverLayer.js";
import keyBaseConfiguration from "../../../../Game/Configuration/KeyConfiguration/keyConfig.js"
import {renderButton, renderHeader} from "./Mixin/RenderElements.js";

export default class KeySettingScreen extends OverLayer{
    constructor() {
        super(...arguments);

        this.keyConfigBase =  keyBaseConfiguration;
        this._renderButton = renderButton;
        this.inputs = {}
    }

    render(keyConfig) {
        this.keyConfigBase = keyConfig || this.keyConfigBase;

        super.render('key-setting');

        let saveButton = this._renderButton('save', 'btn-save');
        saveButton.addEventListener('click', ()=>{
            this.hide();
            for(let inputAction in this.inputs){
                this.keyConfigBase.actions[inputAction] = this.inputs[inputAction].value.split(" ");
            }
            this.fire('saveKeyConfiguration', this.keyConfigBase);
        })

        let actionItemContainer = document.createElement('ul');
        actionItemContainer.classList.add('key-setting-items')
        for(let actionName in this.keyConfigBase.actions) {
            let {div, input} = this._renderActionItem(actionName, this.keyConfigBase.actions[actionName])
            this.inputs[actionName] = input;
            actionItemContainer.append(div);
        }
        this.content.append(renderHeader('Key configuration'));
        this.content.append(actionItemContainer);
        this.content.append(saveButton)
    }


    _getHumanActionName(actionName){
        const regex =  /(?<first>[a-z]+)(?<bigLetter>[A-Z]{1})(?<rest>[a-z]+)/;
        let match = actionName.match(regex);

        if(match){
            return upperFirst(match.groups.first) + " " + match.groups.bigLetter.toLocaleLowerCase() + match.groups.rest;
        }
        return upperFirst(actionName);

        function upperFirst(str){
            return  str[0].toUpperCase() + str.substr(1);
        }
    }

    _renderActionItem(actionName, keys){
        let container = document.createElement('li');
        container.classList.add('key-setting-item-container');
        container.classList.add(actionName);
        let span = document.createElement('span')
        span.classList.add('key-config-item-span');
        span.classList.add(actionName);
        span.textContent = this._getHumanActionName(actionName);
        let input = document.createElement('input');
        input.type="text";
        input.classList.add('key-config-item-input');
        input.classList.add(actionName);
        input.value = keys;

        input.addEventListener('keydown', function (event){
            event.preventDefault();
            if(event.code === 'Backspace'){
                this.value = "";
                return;
            }
            if(this.value.indexOf(event.code) === -1 ){
                this.value +=  ((this.value === "") ? "" : " " ) + event.code;
            }


        })

        container.append(span);
        container.append(input);
        return {div: container, input: input};
    }

    update(){}
}