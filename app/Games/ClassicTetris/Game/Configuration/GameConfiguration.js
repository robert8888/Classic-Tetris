const gameConfiguration = {
    size : {
        'standard' : {
            col: 10,
            row: 22,
        },
        'big' : {
            col: 12,
            row: 26,
        },
        'large' : {
            col: 14,
            row: 30,
        }
    },
    levels : [
        {
        name : "1",
        stepTime: 1000, // ms
        pointForRow: 100,
        pointLimit : 1000,
        },
        {
            name : "1",
            stepTime: 1000, // ms
            pointForRow: 125,
            pointLimit : 2250,
        },
        {
            name : "2",
            stepTime: 950, // ms
            pointForRow: 150,
            pointLimit : 3750,
        },
        {
            name : "3",
            stepTime: 900, // ms
            pointForRow: 250,
            pointLimit : 7250,
        },
        {
            name : "4",
            stepTime: 850, // ms
            pointForRow: 300,
            pointLimit : 9250,
        },
        {
            name : "5",
            stepTime: 800, // ms
            pointForRow: 350,
            pointLimit : 12750,
        },
        {
            name : "6",
            stepTime: 750, // ms
            pointForRow: 400,
            pointLimit : 16750,
        },
        {
            name : "7",
            stepTime: 700, // ms
            pointForRow: 500,
            pointLimit : 21750,
        },
        {
            name : "8",
            stepTime: 650, // ms
            pointForRow: 550,
            pointLimit : 27250,
        },
        {
            name : "9",
            stepTime: 600, // ms
            pointForRow: 600,
            pointLimit : 33250,
        },
        {
            name : "10",
            stepTime: 550, // ms
            pointForRow: 650,
            pointLimit : 39750,
        },
        {
            name : "11",
            stepTime: 500, // ms
            pointForRow: 700,
            pointLimit : 46750,
        },
        {
            name : "12",
            stepTime: 450, // ms
            pointForRow: 800,
            pointLimit : 54750,
        },
        {
            name : "13",
            stepTime: 400, // ms
            pointForRow: 900,
            pointLimit : 63750,
        },
        {
            name : "14",
            stepTime: 350, // ms
            pointForRow: 1000,
            pointLimit : 73750,
        },
        {
            name : "15",
            stepTime: 300, // ms
            pointForRow: 1100,
            pointLimit : 84750,
        },
        {
            name : "16",
            stepTime: 250, // ms
            pointForRow: 1200,
            pointLimit : 96750,
        },
        {
            name : "17",
            stepTime: 200, // ms
            pointForRow: 1500,
            pointLimit : 99750,
        }
        ,
        {
            name : "18",
            stepTime: 150, // ms
            pointForRow: 2000,
            pointLimit : 120000,
        }
        ,
        {
            name : "19",
            stepTime: 100, // ms
            pointForRow: 3000,
            pointLimit : 150000,
        }
        ,
        {
            name : "20",
            stepTime: 50, // ms
            pointForRow: 5000,
            pointLimit : 200000,
        }

    ]
}

export default gameConfiguration;