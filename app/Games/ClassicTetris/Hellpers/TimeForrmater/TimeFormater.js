export default class TimeFormatter {
    constructor() {
    }

    formatTime(time){

        let second = Math.floor(time/1000) % 60;
        let minut = Math.floor(time / 1000 / 60) % 60;
        let houre = Math.floor( time /1000/ 3600);
        return {
            h: houre,
            m: minut,
            s: second,
        }
    }

    string(time){
        let {h, m , s} = this.formatTime(time);
        return ` ${h ? h +' :' : ''}${m ? m +':' : ''}${s < 10 ? "0"+s : s}`;
    }

    stringDescribed(time){
        let format = this.formatTime(time);
        return ` ${format.h ? format.h +'h:':''}${format.m ? format.m +'m:' : ''}${format.s}s`;
    }
}