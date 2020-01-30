import CTetris from "./Games/ClassicTetris/CTetris.js";

let config = {
    "keyConfig":
        {
            "actions":
                {
                    "moveLeft":["ArrowLeft"],
                    "moveRight":["ArrowRight"],
                    "softDrop":["ArrowDown"],
                    "hardDrop":["Space"],
                    "rotate":["ArrowUp"],
                    "pause":["Escape"],
                    "backRotate":["KeyZ"],
                    "autoRotate":["KeyR"]
                }
        },
    "gameConfig":
        {
            "size": ["standard","big", "large"][0],
            "queueVisible":true,
            "showProjection":false,
            "autoRotate":false,
            sound: {
                "soundOn":true,
                "music": false,
                "volume" : 100
            }

        }
}


export default class App {
    constructor() {

        const container = document.getElementById('game-container');
        let tetris = new CTetris(container, config);
        tetris.start();

        tetris.on('userConfigUpdate', (config)=>{
            console.log('game config changed', config)
        });
        tetris.on('gameOver', (results) => {
            console.log('game over', results);
        })
    }
}