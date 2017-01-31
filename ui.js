function initCanvas() {
    var canvas = document.getElementById("webgl-canvas");
    var bonus = document.getElementById("bonus");
    var cc = document.getElementById("canvas-container");
    var menu = document.getElementById("game-menu");
    var container = document.getElementById("container");
    var w = window.innerWidth;
    var h = window.innerHeight;

    a = Math.min(w, h) * 0.7;
    canvas.width = canvas.height = a;
    bonus.style.width = cc.style.width = cc.style.height = a + 'px';
    bonus.style.top = (a / 2 - 20) + 'px';
    menu.style.left = menu.style.top = a / 4 + 'px';
    container.style.maxWidth = (100 + a) + 'px';

    initWebGL();
}


window.onkeydown = handleKeyPressed;

function handleKeyPressed(ev) {
    // 32 -> spacebar
    if (ev.keyCode == 32) {
        togglePause();
        return;
    }

    var directions = {
        // les clés doivent être des strings, la conversion int->str se fait automatiquement
        "87": "back",              // 87 -> W
        "65": "left", "37": "left",  // 65 -> A, 37 -> left arrow
        "83": "front",             // 83 -> S
        "68": "right", "39": "right",// 68 -> D, 39 -> right arrow
        "38": "up",                // 38 -> up arrow
        "40": "down"               // 40 -> down arrow
    };
    changeDirection(directions[ev.keyCode]);
}


myScroll = new IScroll('#canvas-container', {
    tap: true,
    mouseWheel: true,
    mouseWheelSpeed: 200
});

myScroll.on('scrollEnd', function () {
    // Si l'événement provient de la roulette, c'est l'attribut directionX (pourquoi X ? je ne sais pas)
    // qui détermine la direction
    // Sinon si l'événement vient d'un swipe du doigts, on regarde dans l'attribut distY le chemin parcouru en Y
    if (this.directionX == 1 || this.distY > 50) {
        changeDirection("front");
    } else if (this.directionX == -1 || this.distY < -50) {
        changeDirection("back");
    }
});

document.getElementById("canvas-container").addEventListener('tap', function (e) {
    if (gameover) return;
    var w = parseInt(this.style.width);
    var left = e.pageX - this.getBoundingClientRect().left;
    ;
    var top = e.pageY - this.getBoundingClientRect().top;
    var right = w - left;
    var bottom = w - top;
    if (getStandardDeviation([left, top, right, bottom], 1) / w < 0.1) {
        togglePause();
        e.stopPropagation();
        return;
    }
    var choices = [
        {dist: left, direction: "left"},
        {dist: top, direction: "up"},
        {dist: bottom, direction: "down"},
        {dist: right, direction: "right"}
    ];
    var min = choices[0];
    choices.forEach(function (choice) {
        if (choice.dist < min.dist)
            min = choice
    });
    changeDirection(min.direction);
}, false);

function restart() {
    if (paused)
        togglePause()
    initScene()
}

function toggleHelp() {
    help = document.getElementById("help");
    if (help.style.display == "block") {
        help.style.display = "none";
    } else {
        help.style.display = "block";
        if (!paused)
            togglePause();
    }
}


function toggleMute(btn_mute) {
    if (muted) {
        btn_mute.style.color = "red";
    } else {
        btn_mute.style.color = "blue";
    }
    muted = !muted;
}

document.getElementById("music").volume = 0.8;
function toggleMusic(btn_music) {
    var audio = document.getElementById("music");
    if (audio.volume == 0) {
        audio.volume = 0.8;
        btn_music.style.color = "red";
    } else {
        audio.volume = 0;
        btn_music.style.color = "blue";
    }
}

function displayMessage(msg) {
    document.getElementById("bonus").innerHTML = msg;
    setTimeout(function () {
        document.getElementById("bonus").innerHTML = "";
    }, 1500);
}

function playSound(id) {
    if (muted)return;
    var audio = document.getElementById(id);
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}


// merci à http://bateru.com/news/2011/03/javascript-standard-deviation-variance-average-functions/
// Programmer: Larry Battle
// Date: Mar 06, 2011
// Purpose: Calculate standard deviation, variance, and average among an array of numbers.
var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    },
    getNumWithSetDec = function (num, numOfDec) {
        var pow10s = Math.pow(10, numOfDec || 0);
        return ( numOfDec ) ? Math.round(pow10s * num) / pow10s : num;
    },
    getAverageFromNumArr = function (numArr, numOfDec) {
        if (!isArray(numArr)) {
            return false;
        }
        var i = numArr.length,
            sum = 0;
        while (i--) {
            sum += numArr[i];
        }
        return getNumWithSetDec((sum / numArr.length ), numOfDec);
    },
    getVariance = function (numArr, numOfDec) {
        if (!isArray(numArr)) {
            return false;
        }
        var avg = getAverageFromNumArr(numArr, numOfDec),
            i = numArr.length,
            v = 0;

        while (i--) {
            v += Math.pow((numArr[i] - avg), 2);
        }
        v /= numArr.length;
        return getNumWithSetDec(v, numOfDec);
    },
    getStandardDeviation = function (numArr, numOfDec) {
        if (!isArray(numArr)) {
            return false;
        }
        var stdDev = Math.sqrt(getVariance(numArr, numOfDec));
        return getNumWithSetDec(stdDev, numOfDec);
    };