import OverLayer from "./OverLayer.js";
import {renderInput, renderButton, renderHeader} from "./Mixin/RenderElements.js";

export default class SettingScreen extends OverLayer{
    constructor(props) {
        super(props);

    }
    render(){
        super.render('game-setting');
        let header = renderHeader('Game Settings');//document.createElement('h2');
        //header.textContent ="Game Settings";

        let {selectSizeDiv, sizeElements, getSize, checkSize } = this._renderSelectSize();

        let {liItem: queueVisibleItem,inputElement: queueVisibleElement} = renderInput('Show shape queue ', 'queue', {type:"checkbox"});
        let {liItem: projectionVisibleItem,inputElement: projectionVisibleElement} = renderInput('Show shape projection', 'projection', {type:"checkbox"});
        let {liItem: autoRotateItem,inputElement: autoRotateElement} = renderInput('Enable shape autorotate ', 'auto-rotate', {type:"checkbox"});
        let {liItem: soundOnItem, inputElement: soundOnElement} = renderInput('Turn on game sounds', 'sound-on', {type:"checkbox"});
        let {liItem: musicOnItem, inputElement: musicOnElement} = renderInput('Turn on music ', 'music-on', {type:"checkbox"});
        let {liItem: soundVolumeItem, inputElement: soundVolumeElement} = renderInput('Volume ', 'sound-volume', {type:"range", min:0, max: 100} );


        let userConfig  = this._state.userConfig.gameConfig;
        if(userConfig){
            if(userConfig.queueVisible)  {
                queueVisibleItem.classList.add('checked');
                queueVisibleElement.checked = true;
            }
            if(userConfig.showProjection){
                projectionVisibleItem.classList.add('checked');
                projectionVisibleElement.checked = true;
            }
            if(userConfig.autoRotate){
                autoRotateItem.classList.add('checked');
                autoRotateElement.checked = true;
            }
            if(userConfig.sound.soundOn){
                soundOnItem.classList.add('checked');
                soundOnElement.checked = true;
            }
            if(userConfig.sound.music){
                musicOnItem.classList.add('checked');
                musicOnElement.checked = true;
            }
            if(userConfig.sound.soundOn || userConfig.sound.music) {
                soundVolumeItem.classList.add('checked');
                soundVolumeElement.value = userConfig.sound.volume;
            }

            //sizeElements[userConfig.size].checked = true;
            checkSize(userConfig.size);
        } else {
            checkSize('standard')
        }

        this.startButton = this._renderButton('start', 'btn-start');
        this.startButton.addEventListener('click', ()=>{
            this.hide();
            const config = {
                size: getSize(),//selectSizeElement.options[selectSizeElement.selectedIndex].value,
                queueVisible: queueVisibleElement.checked,
                showProjection: projectionVisibleElement.checked,
                autoRotate: autoRotateElement.checked,
                sound : {
                    soundOn : soundOnElement.checked,
                    music : musicOnElement.checked,
                    volume: soundVolumeElement.value
                }
            };
            this.fire('start', config);
        });

        this.keyConfigButton = renderButton('key configuration', 'btn-key-config');
        this.keyConfigButton.addEventListener('click', ()=>{
            this.hide();
            this.fire('goToKeyConfiguration')
        })

        let settingList = document.createElement('ul');
        settingList.classList.add('setting-list')
        settingList.append(selectSizeDiv);
        settingList.append(queueVisibleItem);
        settingList.append(projectionVisibleItem);
        settingList.append(autoRotateItem);
        settingList.append(soundOnItem);
        settingList.append(musicOnItem);
        settingList.append(soundVolumeItem);
        this.content.append(header);
        this.content.append(settingList);
        this.content.append(this.keyConfigButton);
        this.content.append(this.startButton);

    }

    _renderSelectSize(){

        let selectSizeHtml= `
                        <ul class="size-list">
                        <li class="size-list-ratio">
                         <input name="size-radio" type="radio" id="input-size-std" value="standard" checked>
                        <label for="id-size-std">standard 10 x 20</label>
                        </li>
                        <li class="size-list-ratio"  >
                        <input name="size-radio" type="radio" id="input-size-big"  value="big">
                        <label for="id-size-big">big 12 x 24</label>
                        </li>
                        <li class="size-list-ratio" >
                        <input name="size-radio" type="radio" id="input-size-large"  value="large">
                        <label for="id-size-large">large 14 x 28</label>
                        </li>
                       </ul>`
        let selectSizeDiv = document.createElement('li');
        selectSizeDiv.innerHTML = selectSizeHtml;
        selectSizeDiv.classList.add('size');
        selectSizeDiv.classList.add('setting-element');
        const radios = {
            "standard" : selectSizeDiv.querySelector('#input-size-std'),
            "big" : selectSizeDiv.querySelector('#input-size-big'),
            "large": selectSizeDiv.querySelector('#input-size-large')
        }

        radios.big.parentElement.addEventListener('click', check)
        radios.standard.parentElement.addEventListener('click', check)
        radios.large.parentElement.addEventListener('click', check)

        function checkRadio(size) {
            unCheckAll();
            radios[size].closest('li').classList.add('checked');
            radios[size].checked = true;
        }
        function check(e){
            unCheckAll();
            console.log('check');

            if((e.target instanceof HTMLInputElement)){
               e.target.parentElement.classList.add('checked');
               return
            } else {
                let input = e.target.closest('li').children[0];

                    input.checked = true;
                    input.parentElement.classList.add('checked');

            }

        }

        function unCheckAll(){
            for(let size in radios){
                radios[size].checked = false;
                radios[size].parentElement.classList.remove('checked')
            }
        }

        let getSize = ()=>{
            if(radios["standard"].checked)
                return "standard";
            if(radios["big"].checked)
                return "big";
            if(radios["large"].checked)
                return "large";
            return "standard"
        };

        return {selectSizeDiv, sizeElements : radios, getSize : getSize,  checkSize: checkRadio}
    }


    update(){

    }
}