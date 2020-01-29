export function renderInput(text, className, inputAttr, updateCallback){
    let liHtml= `<input class="${className + '-input'}"`;
    for(let [attr, value] of Object.entries(inputAttr)){
        liHtml += ' ' + attr + '="'+ value + '" ';
    }
    liHtml += `><label class="${className + '-label'}">${text}</label>`;

    let liItem = document.createElement('li');
    liItem.innerHTML = liHtml;
    liItem.classList.add(className);
    liItem.classList.add('setting-element');
    let input = liItem.children[0];

    liItem.addEventListener('click', (e)=>{
        liItem.classList.toggle('checked');
        if(!(e.target instanceof HTMLInputElement)){
            input.checked = !input.checked;
        }
        //binding music and sound on with volume state
        if(e.target.closest('ul').querySelector('.music-on>input').checked
            || e.target.closest('ul').querySelector('.sound-on>input').checked){
            e.target.closest('ul').querySelector('li.sound-volume').classList.add('checked')
        } else {
            e.target.closest('ul').querySelector('li.sound-volume').classList.remove('checked');
        };

        updateCallback(className);
    })
    return {liItem: liItem, inputElement : input}
}


export function renderButton( text, className){
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    return button;
}



export function renderHeader(text, type='h2'){
    let header = document.createElement(type);
    header.textContent = text;
    return header;
}
