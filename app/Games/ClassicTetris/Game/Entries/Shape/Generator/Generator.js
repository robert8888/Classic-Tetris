export default class Generator {
    constructor() {
    }

    _getRandomNumber(range){
        this._c = 0x80000000 // 2 ^ 31;
        this._c--;
        const a = 12645674897964;
        const b = 4546432168545;

        const time = (new Date()).getTime();
        let result = time * Math.random() * this._c;
        result = Math.floor(result) + a;
        result %= b;

        result %= range;
        return result;
    }

}